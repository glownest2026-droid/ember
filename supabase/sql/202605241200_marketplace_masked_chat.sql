-- PR7: Masked marketplace conversations, messages, reports, and blocks.

CREATE TABLE IF NOT EXISTS public.marketplace_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  seller_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_id UUID NULL REFERENCES public.marketplace_listing_interests(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'blocked', 'reported', 'closed')),
  last_message_at TIMESTAMPTZ NULL,
  seller_last_read_at TIMESTAMPTZ NULL,
  buyer_last_read_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (listing_id, buyer_user_id),
  CHECK (buyer_user_id <> seller_user_id)
);

CREATE INDEX IF NOT EXISTS marketplace_conversations_seller_user_id_idx
  ON public.marketplace_conversations (seller_user_id, last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS marketplace_conversations_buyer_user_id_idx
  ON public.marketplace_conversations (buyer_user_id, last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS marketplace_conversations_listing_id_idx
  ON public.marketplace_conversations (listing_id);

CREATE TABLE IF NOT EXISTS public.marketplace_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.marketplace_conversations(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text'
    CHECK (message_type IN ('text', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  edited_at TIMESTAMPTZ NULL,
  deleted_at TIMESTAMPTZ NULL,
  client_request_id TEXT NULL,
  CHECK (char_length(trim(body)) >= 1 AND char_length(body) <= 2000)
);

CREATE INDEX IF NOT EXISTS marketplace_messages_conversation_id_idx
  ON public.marketplace_messages (conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS marketplace_messages_listing_id_idx
  ON public.marketplace_messages (listing_id);

CREATE TABLE IF NOT EXISTS public.marketplace_conversation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.marketplace_conversations(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  reporter_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NULL,
  details TEXT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'reviewed', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_conversation_reports_conversation_id_idx
  ON public.marketplace_conversation_reports (conversation_id);

CREATE TABLE IF NOT EXISTS public.marketplace_user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID NULL REFERENCES public.marketplace_conversations(id) ON DELETE SET NULL,
  listing_id UUID NULL REFERENCES public.marketplace_listings(id) ON DELETE SET NULL,
  reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (blocker_user_id, blocked_user_id, conversation_id)
);

CREATE INDEX IF NOT EXISTS marketplace_user_blocks_blocker_idx
  ON public.marketplace_user_blocks (blocker_user_id);

DROP TRIGGER IF EXISTS marketplace_conversations_updated_at ON public.marketplace_conversations;
CREATE TRIGGER marketplace_conversations_updated_at
  BEFORE UPDATE ON public.marketplace_conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS marketplace_conversation_reports_updated_at ON public.marketplace_conversation_reports;
CREATE TRIGGER marketplace_conversation_reports_updated_at
  BEFORE UPDATE ON public.marketplace_conversation_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.marketplace_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_conversation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_user_blocks ENABLE ROW LEVEL SECURITY;

-- Conversations: participants can read
DROP POLICY IF EXISTS "marketplace_conversations_select_participant" ON public.marketplace_conversations;
CREATE POLICY "marketplace_conversations_select_participant" ON public.marketplace_conversations
  FOR SELECT TO authenticated
  USING (buyer_user_id = auth.uid() OR seller_user_id = auth.uid());

-- Buyer creates conversation (server route validates listing/interest)
DROP POLICY IF EXISTS "marketplace_conversations_insert_buyer" ON public.marketplace_conversations;
CREATE POLICY "marketplace_conversations_insert_buyer" ON public.marketplace_conversations
  FOR INSERT TO authenticated
  WITH CHECK (buyer_user_id = auth.uid() AND buyer_user_id <> seller_user_id);

-- Participants update read timestamps / status on own conversations
DROP POLICY IF EXISTS "marketplace_conversations_update_participant" ON public.marketplace_conversations;
CREATE POLICY "marketplace_conversations_update_participant" ON public.marketplace_conversations
  FOR UPDATE TO authenticated
  USING (buyer_user_id = auth.uid() OR seller_user_id = auth.uid())
  WITH CHECK (buyer_user_id = auth.uid() OR seller_user_id = auth.uid());

-- Messages: participants read non-deleted
DROP POLICY IF EXISTS "marketplace_messages_select_participant" ON public.marketplace_messages;
CREATE POLICY "marketplace_messages_select_participant" ON public.marketplace_messages
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM public.marketplace_conversations c
      WHERE c.id = conversation_id
        AND (c.buyer_user_id = auth.uid() OR c.seller_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "marketplace_messages_insert_sender" ON public.marketplace_messages;
CREATE POLICY "marketplace_messages_insert_sender" ON public.marketplace_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.marketplace_conversations c
      WHERE c.id = conversation_id
        AND c.status = 'open'
        AND (
          (c.buyer_user_id = auth.uid() AND recipient_user_id = c.seller_user_id)
          OR (c.seller_user_id = auth.uid() AND recipient_user_id = c.buyer_user_id)
        )
    )
  );

-- Reports: reporter inserts as participant
DROP POLICY IF EXISTS "marketplace_conversation_reports_select_own" ON public.marketplace_conversation_reports;
CREATE POLICY "marketplace_conversation_reports_select_own" ON public.marketplace_conversation_reports
  FOR SELECT TO authenticated
  USING (reporter_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_conversation_reports_insert_reporter" ON public.marketplace_conversation_reports;
CREATE POLICY "marketplace_conversation_reports_insert_reporter" ON public.marketplace_conversation_reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_user_id = auth.uid());

-- Blocks: blocker owns row
DROP POLICY IF EXISTS "marketplace_user_blocks_select_own" ON public.marketplace_user_blocks;
CREATE POLICY "marketplace_user_blocks_select_own" ON public.marketplace_user_blocks
  FOR SELECT TO authenticated
  USING (blocker_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_user_blocks_insert_own" ON public.marketplace_user_blocks;
CREATE POLICY "marketplace_user_blocks_insert_own" ON public.marketplace_user_blocks
  FOR INSERT TO authenticated
  WITH CHECK (blocker_user_id = auth.uid());

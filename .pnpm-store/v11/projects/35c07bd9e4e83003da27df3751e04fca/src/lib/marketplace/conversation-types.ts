export type ConversationStatus = "open" | "blocked" | "reported" | "closed";

export type SafeConversationParticipant = {
  role: "buyer" | "seller";
  display_label: string;
};

export type SafeConversationListing = {
  title: string;
  approximate_area_label: string | null;
  condition: string | null;
};

export type SafeMessage = {
  id: string;
  body: string;
  message_type: "text" | "system";
  is_mine: boolean;
  created_at: string;
  privacy_warning?: string | null;
};

export type ConversationSummary = {
  id: string;
  listing_id: string;
  listing_title: string;
  approximate_area_label: string | null;
  role: "buyer" | "seller";
  other_participant_label: string;
  last_message_snippet: string | null;
  last_message_at: string | null;
  unread_count: number;
  status: ConversationStatus;
};

export type ConversationDetail = {
  id: string;
  status: ConversationStatus;
  listing: SafeConversationListing;
  participant: SafeConversationParticipant;
  other_participant: SafeConversationParticipant;
  messages: SafeMessage[];
  can_send: boolean;
  safety_guidance: string[];
};

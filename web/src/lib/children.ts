import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

/**
 * Allowed gender values must always stay in sync with the DB CHECK constraint
 * on public.children.gender.
 */
export const genderOptions = [
  'female',
  'male',
  'non_binary',
  'prefer_not_to_say',
  'other',
] as const;

export type GenderOption = (typeof genderOptions)[number];

/**
 * Raw row shape as it exists in the `public.children` table.
 * We keep this minimal and aligned with the Supabase schema.
 */
export interface ChildRow {
  id: string;
  user_id: string;
  date_of_birth: string; // YYYY-MM-DD (Postgres date as ISO string)
  gender: GenderOption;
  interests: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Domain-friendly shape we’ll use in the app.
 * Note we intentionally DO NOT include any name field.
 */
export interface Child {
  id: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: GenderOption;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Zod schema for user-facing form input.
 * The form will pass a YYYY-MM-DD string for dateOfBirth.
 */
export const childFormSchema = z.object({
  dateOfBirth: z
    .string()
    .min(1, { message: 'Date of birth is required' }),
  gender: z.enum(genderOptions, {
    errorMap: () => ({ message: 'Please choose a valid option' }),
  }),
  interests: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: 'Interest cannot be empty' })
    )
    .max(20, { message: 'Please choose at most 20 interests' })
    .default([]),
});

export type ChildFormInput = z.infer<typeof childFormSchema>;

export type TypedSupabaseClient = SupabaseClient<any>;

/**
 * Internal mapper from DB row to app shape.
 */
function mapRowToChild(row: ChildRow): Child {
  return {
    id: row.id,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    interests: row.interests ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Fetch all children for a given user.
 * RLS will also enforce user_id = auth.uid(), but we filter explicitly for clarity.
 */
export async function listChildren(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<Child[]> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', userId)
    .order('date_of_birth', { ascending: true });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return (data as ChildRow[]).map(mapRowToChild);
}

/**
 * Create a new child profile for the given user.
 * Caller must pass the authenticated userId; DB RLS will verify it matches auth.uid().
 */
export async function createChild(
  supabase: TypedSupabaseClient,
  userId: string,
  input: ChildFormInput
): Promise<Child> {
  const parsed = childFormSchema.parse(input);

  const { data, error } = await supabase
    .from('children')
    .insert({
      user_id: userId,
      date_of_birth: parsed.dateOfBirth,
      gender: parsed.gender,
      interests: parsed.interests,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapRowToChild(data as ChildRow);
}

/**
 * Update an existing child profile.
 * RLS ensures the row belongs to the current user.
 */
export async function updateChild(
  supabase: TypedSupabaseClient,
  userId: string,
  childId: string,
  input: ChildFormInput
): Promise<Child> {
  const parsed = childFormSchema.parse(input);

  const { data, error } = await supabase
    .from('children')
    .update({
      user_id: userId, // keep user_id pinned to the owner
      date_of_birth: parsed.dateOfBirth,
      gender: parsed.gender,
      interests: parsed.interests,
    })
    .eq('id', childId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapRowToChild(data as ChildRow);
}

/**
 * Delete a child profile.
 * RLS enforces ownership, we filter by id + userId for good measure.
 */
export async function deleteChild(
  supabase: TypedSupabaseClient,
  userId: string,
  childId: string
): Promise<void> {
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

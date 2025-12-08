'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSupabase } from '@/lib/supabase';
import {
  childFormSchema,
  type ChildFormInput,
  type Child,
  genderOptions,
  listChildren,
  createChild,
  updateChild,
  deleteChild,
} from '@/lib/children';

export default function ChildrenPage() {
  // Memoise the client so it only gets created once per mount
  const supabase = useMemo(() => getSupabase(), []);

  const [children, setChildren] = useState<Child[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);

  const form = useForm<ChildFormInput>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      dateOfBirth: '',
      gender: 'prefer_not_to_say',
      interests: [],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'interests',
  });

  // Initial load: get user, then fetch children
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setLoadingError(null);

        if (!supabase) {
          setLoadingError(
            'Supabase client is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
          );
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.getUser();

        // If there is no session, treat it as "not signed in" instead of hard error
        if (authError) {
          const msg = authError.message ?? '';
          if (
            msg.includes('Auth session missing') ||
            authError.name === 'AuthSessionMissingError'
          ) {
            setLoadingError('You need to be signed in to view child profiles.');
            return;
          }

          // Anything else we treat as a real error
          throw authError;
        }

        if (!authData?.user) {
          setLoadingError('You need to be signed in to view child profiles.');
          return;
        }

        const uid = authData.user.id;
        if (cancelled) return;

        setUserId(uid);

        const list = await listChildren(supabase, uid);
        if (cancelled) return;

        setChildren(list);
      } catch (error: any) {
        console.error('Failed to load children', error);
        if (!cancelled) {
          setLoadingError(error?.message ?? 'Something went wrong loading profiles.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const onSubmit = async (values: ChildFormInput) => {
    if (!userId || !supabase) return;

    setSaving(true);
    setSavingError(null);

    try {
      let updated: Child;

      if (editingChildId) {
        updated = await updateChild(supabase, userId, editingChildId, values);
        setChildren((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else {
        updated = await createChild(supabase, userId, values);
        setChildren((prev) => [...prev, updated]);
      }

      reset({
        dateOfBirth: '',
        gender: 'prefer_not_to_say',
        interests: [],
      });
      setEditingChildId(null);
    } catch (error: any) {
      console.error('Failed to save child', error);
      setSavingError(error?.message ?? 'Something went wrong saving the profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (child: Child) => {
    setEditingChildId(child.id);
    reset({
      dateOfBirth: child.dateOfBirth,
      gender: child.gender,
      interests: child.interests ?? [],
    });
  };

  const handleCancelEdit = () => {
    setEditingChildId(null);
    reset({
      dateOfBirth: '',
      gender: 'prefer_not_to_say',
      interests: [],
    });
  };

  const handleDelete = async (childId: string) => {
    if (!userId || !supabase) return;
    if (!confirm('Remove this profile?')) return;

    try {
      await deleteChild(supabase, userId, childId);
      setChildren((prev) => prev.filter((c) => c.id !== childId));
      if (editingChildId === childId) {
        handleCancelEdit();
      }
    } catch (error: any) {
      console.error('Failed to delete child', error);
      alert(error?.message ?? 'Something went wrong deleting the profile.');
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        <h1 className="text-2xl font-semibold">Your little one&apos;s profiles</h1>
        <p className="text-sm text-gray-500">Loading profiles…</p>
      </main>
    );
  }

  if (loadingError) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
        <h1 className="text-2xl font-semibold">Your little one&apos;s profiles</h1>
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {loadingError}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Your little one&apos;s profiles</h1>
        <p className="text-sm text-gray-600">
          We never ask for your child&apos;s name. Tell us about their stage instead:
          age, gender, and what they&apos;re into.
        </p>
      </header>

      {/* Existing children list */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Profiles</h2>
        {children.length === 0 ? (
          <p className="text-sm text-gray-500">
            No profiles yet. Add your first profile below.
          </p>
        ) : (
          <ul className="space-y-3">
            {children.map((child) => (
              <li
                key={child.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 p-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1 text-sm">
                  <div className="font-medium">
                    Age / DOB:{' '}
                    <span className="font-normal text-gray-700">
                      {child.dateOfBirth}
                    </span>
                  </div>
                  <div>
                    Gender:{' '}
                    <span className="text-gray-700">{child.gender}</span>
                  </div>
                  <div>
                    Interests:{' '}
                    {child.interests.length === 0 ? (
                      <span className="text-gray-400">None yet</span>
                    ) : (
                      <span className="text-gray-700">
                        {child.interests.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-2 text-sm md:pt-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(child)}
                    className="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(child.id)}
                    className="rounded-md border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Add / Edit form */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">
            {editingChildId ? 'Edit profile' : 'Add a profile'}
          </h2>
          {editingChildId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-gray-500 underline"
            >
              Cancel edit
            </button>
          )}
        </div>

        {savingError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {savingError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Date of birth */}
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="dateOfBirth">
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('dateOfBirth')}
            />
            {errors.dateOfBirth && (
              <p className="text-xs text-red-600">
                {errors.dateOfBirth.message as string}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('gender')}
            >
              <option value="" disabled>
                Select…
              </option>
              {genderOptions.map((option) => (
                <option key={option} value={option}>
                  {option
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-xs text-red-600">
                {errors.gender.message as string}
              </p>
            )}
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Interests (optional)
            </label>
            <p className="text-xs text-gray-500">
              Add a few things they love right now (e.g. trains, dinosaurs, music).
            </p>

            <div className="space-y-2">
              {fields.length === 0 && (
                <p className="text-xs text-gray-400">
                  No interests yet – add one below.
                </p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    {...register(`interests.${index}` as const)}
                    placeholder="e.g. trains"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append('')}
                className="text-xs text-emerald-700 underline"
              >
                Add interest
              </button>
            </div>

            {errors.interests && (
              <p className="text-xs text-red-600">
                {(errors.interests as any)?.message ??
                  'Please check your interests.'}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <p className="text-xs text-gray-500">
              We use this info to tailor guidance, never to identify your child.
            </p>
            <button
              type="submit"
              disabled={saving || !userId || !supabase}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {saving
                ? 'Saving...'
                : editingChildId
                ? 'Save changes'
                : 'Add profile'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

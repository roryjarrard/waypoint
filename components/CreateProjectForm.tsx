"use client";

import { useActionState } from "react";

type FormState = { error: string | null };

export function CreateProjectForm({
  action,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <h2 className="text-lg font-semibold">Create a project</h2>
      <label htmlFor="project-name">Name</label>
      <input
        id="project-name"
        name="name"
        required
        maxLength={120}
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "project-form-error" : undefined}
        className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
      />
      <label htmlFor="project-description">Description (optional)</label>
      <textarea
        id="project-description"
        name="description"
        maxLength={500}
        rows={2}
        className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
      />
      {state.error && (
        <p
          id="project-form-error"
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Creating..." : "Create project"}
      </button>
    </form>
  );
}

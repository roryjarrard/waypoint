"use client";

import { useActionState, useState } from "react";

import { updateProjectAction } from "@/lib/actions/update-project";
import type { Project } from "@/lib/types";

type FormState = {
  error: string | null;
  saved: boolean;
};

const initialState: FormState = {
  error: null,
  saved: false,
};

export function EditProjectForm({
  project,
  onSaved,
  onCancel,
}: {
  project: Pick<Project, "id" | "name" | "description">;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  const [state, formAction, pending] = useActionState(
    async (previousState: FormState, formData: FormData) => {
      const result = await updateProjectAction(
        project.id,
        previousState,
        formData,
      );

      if (result.saved) {
        onSaved();
      }

      return result;
    },
    initialState,
  );

  const nameId = `edit-project-name-${project.id}`;
  const descriptionId = `edit-project-description-${project.id}`;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>

      <label htmlFor={nameId}>Name</label>
      <input
        id={nameId}
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        maxLength={120}
        className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
      />

      <label htmlFor={descriptionId}>Description (optional)</label>
      <textarea
        id={descriptionId}
        name="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        maxLength={500}
        rows={3}
        className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
      />

      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="rounded border border-zinc-300 px-4 py-2 disabled:opacity-50 dark:border-zinc-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";

import { deleteProjectAction } from "@/lib/actions/delete-project";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="self-start rounded border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
      >
        Delete project
      </button>
    );
  }

  return (
    <DeleteConfirmation
      projectId={projectId}
      onCancel={() => setConfirming(false)}
    />
  );
}

function DeleteConfirmation({
  projectId,
  onCancel,
}: {
  projectId: string;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    deleteProjectAction.bind(null, projectId),
    { error: null },
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-lg border border-red-300 p-4 dark:border-red-800"
    >
      <p className="font-medium text-zinc-950 dark:text-zinc-50">
        Delete this project?
      </p>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        This will permanently delete the project and all of its tasks.
      </p>

      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Deleting..." : "Yes, delete project"}
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

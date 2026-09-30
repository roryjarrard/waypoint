"use client";

import { useState, type ReactNode } from "react";

import { EditProjectForm } from "@/components/EditProjectForm";
import type { Project } from "@/lib/types";

export function ProjectDetailView({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EditProjectForm
        project={project}
        onSaved={() => setEditing(false)}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <>
      {children}

      <button
        type="button"
        onClick={() => setEditing(true)}
        className="self-start rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Edit project
      </button>
    </>
  );
}

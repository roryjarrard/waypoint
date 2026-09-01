import type { TaskPriority } from "@/lib/types";

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low priority",
  medium: "Medium priority",
  high: "High priority",
};

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-300 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

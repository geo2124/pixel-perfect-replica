import { createFileRoute } from "@tanstack/react-router";
import { Strategy } from "@/features/modules/strategy";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/strategy")({
  head: () =>
    pageHead(
      "Strategy and targets",
      "Set measurable objectives, compare routes and track implementation milestones.",
    ),
  component: Strategy,
});

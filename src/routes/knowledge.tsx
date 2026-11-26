import { createFileRoute } from "@tanstack/react-router";
import { Knowledge } from "@/features/modules/knowledge-settings";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/knowledge")({
  head: () =>
    pageHead(
      "Business knowledge repository",
      "Review business facts, assumptions, historical decisions and recorded outcomes.",
    ),
  component: Knowledge,
});

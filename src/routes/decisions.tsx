import { createFileRoute } from "@tanstack/react-router";
import { Decisions } from "@/features/modules/decisions";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/decisions")({
  head: () =>
    pageHead(
      "Reports and decision center",
      "Review evidence, approve simulated decisions and download executive management reports.",
    ),
  component: Decisions,
});

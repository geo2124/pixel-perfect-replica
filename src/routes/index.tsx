import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/features/modules/dashboard";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Executive command center",
      "Business performance, financial health, optimization opportunities and strategic priorities.",
    ),
  component: Dashboard,
});

import { createFileRoute } from "@tanstack/react-router";
import { DataManagement } from "@/features/modules/data";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/data")({
  head: () =>
    pageHead(
      "Data management",
      "Import spreadsheets, map columns and inspect dataset quality and source records.",
    ),
  component: DataManagement,
});

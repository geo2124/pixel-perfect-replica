import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceSettings } from "@/features/modules/knowledge-settings";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/settings")({
  head: () =>
    pageHead(
      "Workspace settings",
      "Manage demonstration data, interface role previews and workspace preferences.",
    ),
  component: WorkspaceSettings,
});

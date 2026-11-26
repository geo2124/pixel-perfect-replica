import { createFileRoute } from "@tanstack/react-router";
import { Assessment } from "@/features/modules/assessment";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/assessment")({
  head: () =>
    pageHead(
      "Business health assessment",
      "A transparent financial assessment with editable source figures and downloadable management reports.",
    ),
  component: Assessment,
});

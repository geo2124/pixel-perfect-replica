import { createFileRoute } from "@tanstack/react-router";
import { BusinessDefinition } from "@/features/modules/business";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/business")({
  head: () =>
    pageHead(
      "Business definition",
      "Define and approve the business concept, operating model, management objectives and constraints.",
    ),
  component: BusinessDefinition,
});

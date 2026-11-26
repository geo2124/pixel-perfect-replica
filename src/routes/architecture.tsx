import { createFileRoute } from "@tanstack/react-router";
import { Architecture } from "@/features/modules/business";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/architecture")({
  head: () =>
    pageHead(
      "Business architecture",
      "Map twelve connected business dimensions, process dependencies and data readiness.",
    ),
  component: Architecture,
});

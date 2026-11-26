import { createFileRoute } from "@tanstack/react-router";
import { Intelligence } from "@/features/modules/intelligence";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/intelligence")({
  head: () =>
    pageHead(
      "Business intelligence workspace",
      "Explore financial, operational, customer and inventory analyses in one connected business model.",
    ),
  component: Intelligence,
});

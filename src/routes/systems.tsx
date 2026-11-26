import { createFileRoute } from "@tanstack/react-router";
import { Systems } from "@/features/modules/systems";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/systems")({
  head: () =>
    pageHead(
      "Systems and integrations",
      "Evaluate right-sized technology and configure simulated data connections.",
    ),
  component: Systems,
});

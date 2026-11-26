import { createFileRoute } from "@tanstack/react-router";
import { Lab } from "@/features/modules/lab";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/lab")({
  head: () =>
    pageHead(
      "Research and optimization lab",
      "Evaluate explainable scenarios, compare assumptions and explore illustrative forecasts.",
    ),
  component: Lab,
});

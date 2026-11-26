import { createFileRoute } from "@tanstack/react-router";
import { Dimension } from "@/features/modules/business";
import { dimensions } from "@/features/platform/model";
import { pageHead } from "@/features/platform/metadata";
export const Route = createFileRoute("/dimensions/$pillar")({
  head: ({ params }) =>
    pageHead(
      `${dimensions.find((d) => d.slug === params.pillar)?.name ?? "Business dimension"} assessment`,
      "Assess business processes, record classified information and review dependencies for this business dimension.",
    ),
  component: DimensionPage,
});
function DimensionPage() {
  const { pillar } = Route.useParams();
  return <Dimension pillar={pillar} />;
}

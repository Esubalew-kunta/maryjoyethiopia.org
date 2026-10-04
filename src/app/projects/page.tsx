import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("projects");

export default function Page() {
  return <PageTemplate slug="projects" />;
}

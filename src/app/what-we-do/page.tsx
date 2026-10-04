import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("what-we-do");

export default function Page() {
  return <PageTemplate slug="what-we-do" />;
}

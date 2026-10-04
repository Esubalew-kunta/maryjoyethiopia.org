import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("vacancy");

export default function Page() {
  return <PageTemplate slug="vacancy" />;
}

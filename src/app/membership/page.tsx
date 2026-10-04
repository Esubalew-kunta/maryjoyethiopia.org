import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("membership");

export default function Page() {
  return <PageTemplate slug="membership" />;
}

import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("in-kind-donation");

export default function Page() {
  return <PageTemplate slug="in-kind-donation" />;
}

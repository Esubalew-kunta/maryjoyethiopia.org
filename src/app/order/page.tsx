import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("order");

export default function Page() {
  return <PageTemplate slug="order" />;
}

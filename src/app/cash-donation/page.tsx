import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("cash-donation");

export default function Page() {
  return <PageTemplate slug="cash-donation" />;
}

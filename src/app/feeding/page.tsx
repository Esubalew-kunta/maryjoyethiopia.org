import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("feeding");

export default function Page() {
  return <PageTemplate slug="feeding" />;
}

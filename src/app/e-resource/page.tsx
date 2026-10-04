import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("e-resource");

export default function Page() {
  return <PageTemplate slug="e-resource" />;
}

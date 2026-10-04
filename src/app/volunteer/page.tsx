import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("volunteer");

export default function Page() {
  return <PageTemplate slug="volunteer" />;
}

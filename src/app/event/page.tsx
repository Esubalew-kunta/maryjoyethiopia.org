import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("event");

export default function Page() {
  return <PageTemplate slug="event" />;
}

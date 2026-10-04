import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("home");

export default function Page() {
  return <PageTemplate slug="home" />;
}

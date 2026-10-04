import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("about-us");

export default function Page() {
  return <PageTemplate slug="about-us" />;
}

import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("contact");

export default function Page() {
  return <PageTemplate slug="contact" />;
}

import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("gallery");

export default function Page() {
  return <PageTemplate slug="gallery" />;
}

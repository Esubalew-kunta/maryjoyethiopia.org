import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("news");

export default function Page() {
  return <PageTemplate slug="news" />;
}

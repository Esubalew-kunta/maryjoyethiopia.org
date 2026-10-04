import type { Metadata } from "next";
import Blocks from "@/components/Blocks";
import { getPage } from "@/lib/site";

export function buildMetadata(slug: string): Metadata {
  const p = getPage(slug);
  return {
    title: p.title,
    description: p.metaDescription,
    openGraph: {
      title: p.title,
      description: p.metaDescription,
      images: p.ogImage ? [p.ogImage] : undefined,
    },
  };
}

export default function PageTemplate({ slug }: { slug: string }) {
  const page = getPage(slug);
  return <Blocks blocks={page.sections} />;
}

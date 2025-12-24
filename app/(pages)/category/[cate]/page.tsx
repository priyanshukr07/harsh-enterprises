import type { Metadata } from "next";
import CateComp from "@/app/components/CateComp";

/**
 * Page props for dynamic category route
 * Next.js 16+ requires params to be async (Promise-based)
 */
type PageProps = {
  params: Promise<{
    cate: string;
  }>;
};

/**
 * Category Page
 * URL: /category/[cate]
 */
export default async function Page({ params }: PageProps) {
  const { cate } = await params;

  return <CateComp cat={cate} />;
}

/**
 * Dynamic SEO metadata per category
 */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { cate } = await params;

  // Convert slug to readable format
  // example: seedling-trays -> Seedling Trays
  const formattedCate = cate
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `${formattedCate} | Harsh Enterprises`,
    description: `Explore premium ${formattedCate.toLowerCase()} from Harsh Enterprises. Trusted agricultural products designed for better growth, yield, and efficiency.`,
  };
}

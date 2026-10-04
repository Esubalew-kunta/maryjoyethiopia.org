import raw from "@/data/content.json";
import type { PageContent } from "@/lib/types";

const pages = raw as PageContent[];

export function getPage(slug: string): PageContent {
  const p = pages.find((x) => x.slug === slug);
  if (!p) throw new Error("Unknown page slug: " + slug);
  return p;
}

export const ORG = {
  name: "Mary Joy Ethiopia",
  tagline: "I WILL RECEIVE IN RETURN OF MY BESTOWS.",
  description:
    "MARY JOY ETHIOPIA Is a non-governmental indigenous humanitarian organization established 30 years ago in 1994. Founded by Sr. Zebider Zewdie and other fellows to address the vulnerability of women in the Asko Area of Addis Ababa.",
  address: "Megenagna ,Addis Abeba ,Ethiopia",
  phones: ["+251987626262", "+251983636363", "+251116686792"],
  email: "info@maryjoyethiopia.org",
};

export const SOCIALS = [
  { name: "TikTok", href: "https://www.tiktok.com/@maryjoyethiopia1", color: "#000000", icon: "tiktok" },
  { name: "Instagram", href: "https://www.instagram.com/mary_joy_ethiopia_official/", color: "#8a3ab9", icon: "instagram" },
  { name: "Facebook", href: "https://www.facebook.com/maryjoyethiopia", color: "#557dbc", icon: "facebook" },
  { name: "Twitter", href: "https://twitter.com/MaryjoyEthiopia", color: "#7acdee", icon: "twitter" },
  { name: "Linkedin", href: "https://et.linkedin.com/company/mary-joy", color: "#1c86c6", icon: "linkedin" },
  { name: "YouTube", href: "https://www.youtube.com/c/MaryJoyEthiopia", color: "#e96651", icon: "youtube" },
];

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about-us/",
    children: [
      { label: "About Us", href: "/about-us/" },
      { label: "Governance", href: "/about-us/#governance" },
      { label: "What We Do", href: "/what-we-do/" },
      { label: "Programs", href: "/programs/" },
      { label: "Collaborate Projects", href: "/projects/" },
      { label: "E-Resources", href: "/e-resource/" },
    ],
  },
  {
    label: "Support",
    href: "#",
    children: [
      { label: "Sponsor Child", href: "/sponsor-child/" },
      { label: "Donation", href: "/cash-donation/" },
      { label: "In-kind Donation", href: "/in-kind-donation/" },
      { label: "Feeding", href: "/feeding/" },
      { label: "Ethiopian Membership", href: "/membership/" },
      { label: "Diaspora Membership", href: "https://forms.gle/x1n2csVhSLpNDqSn7" },
    ],
  },
  {
    label: "Events",
    href: "/event/",
    children: [{ label: "Arbaminch-Charity-Run 2025", href: "/event/arbaminch-charity-run2025/" }],
  },
  { label: "Volunteer", href: "/volunteer/" },
  { label: "Vacancy", href: "/vacancy/" },
  { label: "News", href: "/news/" },
  { label: "Contact", href: "/contact/" },
];

export const WHAT_WE_DO_LINKS = [
  "Livelihood Enhancement",
  "Education",
  "Health Component",
  "Economic Strengthening",
  "Private-public-partnership",
  "Child protection, participation and Empowerment",
];

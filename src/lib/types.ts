export type Button = {
  text: string;
  href: string;
  linkSub?: string;
};

export type CardItem = {
  image?: string;
  title?: string;
  text?: string;
  date?: string;
  badge?: string;
  href?: string;
  linkText?: string;
  linkSub?: string;
};

export type PersonItem = {
  image?: string;
  title?: string;
  subtitle?: string;
  text?: string;
};

export type FaqItem = {
  title: string;
  title2?: string;
  body: string[];
};

export type NewsItem = {
  title: string;
  date: string;
  href: string;
  image?: string;
  excerpt?: string;
  author?: string;
};

export type Block =
  | {
      type: "hero";
      slideshow: string[];
      heading: string;
      subheading: string;
      duration?: number;
    }
  | {
      type: "pageHero" | "bandImage";
      image?: string;
      heading?: string;
      subheading?: string;
    }
  | {
      type: "text";
      heading?: string;
      kicker?: string;
      body?: string[];
      align?: "left" | "center";
      as?: "h1" | "h2";
    }
  | {
      type: "split";
      image?: string;
      imageSide?: "left" | "right";
      heading?: string;
      body: string[];
      bullets?: string[];
      button?: Button | null;
      extra?: { heading: string; body: string[] } | null;
      extra2?: { heading: string; body: string[] } | null;
    }
  | {
      type: "cards";
      heading?: string;
      columns?: number;
      plain?: boolean;
      showDate?: boolean;
      items: CardItem[];
    }
  | { type: "socialFeed" }
  | { type: "stats"; items: { value: string; label: string }[]; button?: Button }
  | { type: "buttonRow"; heading?: string; text?: string; buttons: Button[] }
  | { type: "quote"; text: string; italic?: string; author?: string; button?: Button }
  | {
      type: "pdfList";
      heading?: string;
      items: { text: string; href: string }[];
    }
  | {
      type: "gallery";
      heading?: string;
      columns?: number;
      carousel?: boolean;
      images: string[];
    }
  | { type: "emptyGallery" }
  | {
      type: "list";
      heading?: string;
      icon?: string;
      items: string[];
      numbered?: boolean;
    }
  | {
      type: "infoList";
      heading?: string;
      items: { label: string; value: string }[];
      body?: string[];
      numbered?: string[];
    }
  | {
      type: "accordion";
      heading?: string;
      heading2?: string;
      firstOpen?: boolean;
      items: FaqItem[];
    }
  | { type: "table"; heading?: string; columns: string[]; rows: string[][] }
  | {
      type: "bankList";
      heading?: string;
      subheading?: string;
      items: string[];
    }
  | {
      type: "branches";
      heading?: string;
      intro?: string;
      items: { name: string; phone: string }[];
    }
  | {
      type: "offices";
      heading?: string;
      items: { name: string; address: string; phone: string }[];
    }
  | {
      type: "founder";
      image: string;
      heading: string;
      intro: string;
      sections: { heading: string; body: string[]; bullets?: string[] }[];
    }
  | {
      type: "people";
      heading?: string;
      columns?: number;
      items: PersonItem[];
    }
  | {
      type: "timeline";
      items: { image: string; title: string }[];
    }
  | {
      type: "anchorList";
      heading?: string;
      items: { image: string; title: string; text: string; anchor: string }[];
    }
  | {
      type: "featureGroup";
      anchor?: string;
      heading: string;
      items: {
        image?: string;
        title?: string;
        body?: string[];
        bullets?: string[];
        story?: { heading: string; body: string[] };
      }[];
    }
  | {
      type: "embedForm";
      id: string;
      title?: string;
      subtitle?: string;
      note?: string;
      src: string;
      height: number;
      wide?: boolean;
      bgImage?: string;
    }
  | {
      type: "contactForm";
      heading: string;
      subheading: string;
      fields: { label: string; type: string; required?: boolean }[];
      submitText: string;
    }
  | { type: "map"; heading?: string; src: string }
  | { type: "pdfViewer"; src?: string }
  | {
      type: "slogan";
      text: string;
    }
  | {
      type: "dateChange";
      kicker?: string;
      heading?: string;
      dates: string[];
    }
  | {
      type: "banner";
      kicker?: string;
      text: string;
      href: string;
    }
  | { type: "newsList"; heading?: string; items: NewsItem[] }
  | { type: "newsGrid"; items: NewsItem[] };

export type PageContent = {
  slug: string;
  title: string;
  metaDescription: string;
  ogImage?: string;
  sections: Block[];
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";

export default function Header({ transparent }: { transparent?: boolean }) {
  const pathname = usePathname();

  // The menu is open only for the route it was opened on, so navigating
  // closes it as a natural consequence of the pathname changing.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isCurrent = (href: string) =>
    href !== "#" && (pathname === href || pathname === href.replace(/\/$/, ""));

  return (
    <header className={`site-header${transparent ? " site-header--transparent" : ""}`}>
      <div className="shell header-bar">
        <Link href="/" className="site-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uploads/2024/05/cropped-cropped-logo-1.png" alt="Mary Joy Ethiopia" />
          <span className="site-brand__name">Mary Joy Ethiopia</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Main Menu"
          onClick={() => setOpenedOn(open ? null : pathname)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="nav" data-open={open} id="primary-navigation">
          <ul className="nav-list">
            {NAV.map((item) => (
              <li
                key={item.label}
                className={`nav-item${item.children ? " nav-item--has-children" : ""}${
                  isCurrent(item.href) ? " nav-item--current" : ""
                }`}
              >
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="submenu">
                    {item.children.map((c) => (
                      <li key={c.label}>
                        {c.href.startsWith("http") ? (
                          <a href={c.href} target="_blank" rel="noopener noreferrer">
                            {c.label}
                          </a>
                        ) : (
                          <Link href={c.href}>{c.label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/sponsor-child/" className="header-cta">
          &#10084; SPONSOR A CHILD
        </Link>
      </div>
    </header>
  );
}

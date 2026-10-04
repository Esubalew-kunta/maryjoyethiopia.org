"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/types";

export default function Accordion({
  heading,
  heading2,
  items,
  firstOpen = false,
}: {
  heading?: string;
  heading2?: string;
  items: FaqItem[];
  firstOpen?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(firstOpen ? 0 : null);

  return (
    <div className="accordion">
      {(heading || heading2) && (
        <h2 className="h-sec h-sec--center">
          {heading}
          {heading2 && (
            <>
              <br />
              <span style={{ color: "var(--plum-deep)", fontSize: "0.78em" }}>{heading2}</span>
            </>
          )}
        </h2>
      )}
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className="accordion__item" data-open={isOpen} key={item.title}>
            <button
              type="button"
              className="accordion__btn"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>
                {item.title}
                {item.title2 && <span className="accordion__alt">{item.title2}</span>}
              </span>
            </button>
            {isOpen && (
              <div className="accordion__panel">
                {item.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

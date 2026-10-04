import Link from "next/link";
import Accordion from "@/components/Accordion";
import { FilePdf, listIcon } from "@/components/Icons";
import type { Block, Button, CardItem, FaqItem, NewsItem } from "@/lib/types";

function isExternal(href?: string) {
  return !!href && /^(https?:|sms:|mailto:|tel:|#)/.test(href);
}

function SmartLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  if (isExternal(href)) {
    const plain = href.startsWith("#");
    return (
      <a
        href={href}
        className={className}
        {...(plain ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function Btn({ b, gold }: { b: Button; gold?: boolean }) {
  return (
    <SmartLink href={b.href} className={`btn${gold ? " btn--gold" : ""}`}>
      {b.text}
      {b.linkSub && <span className="btn-sub">{b.linkSub}</span>}
    </SmartLink>
  );
}

function Img({ src, alt = "" }: { src?: string; alt?: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} />;
}

function CardGrid({
  items,
  columns = 3,
  plain,
  showDate,
}: {
  items: CardItem[];
  columns?: number;
  plain?: boolean;
  showDate?: boolean;
}) {
  return (
    <div className={`grid grid--${columns}`}>
      {items.map((c, i) => (
        <article className={`card${plain || !c.image ? " card--plain" : ""}`} key={i}>
          {c.image && (
            <div className="card__media">
              <Img src={c.image} alt={c.title} />
              {c.badge && <span className="card__badge">{c.badge}</span>}
            </div>
          )}
          <div className="card__body">
            {c.title && (
              <h3 className="card__title">
                {c.href ? <SmartLink href={c.href}>{c.title}</SmartLink> : c.title}
              </h3>
            )}
            {c.text && <p className="card__text">{c.text}</p>}
            {(showDate || c.date) && (
              <div className="card__meta">
                {c.date && <span>{c.date}</span>}
                {c.badge && <span>· No Comments</span>}
              </div>
            )}
            {c.linkText && c.href && (
              <SmartLink href={c.href} className="card__more">
                {c.linkText}
              </SmartLink>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function NewsRow({ n }: { n: NewsItem }) {
  return (
    <article className="news-row">
      {n.image && (
        <div className="news-row__media">
          <Img src={n.image} alt={n.title} />
        </div>
      )}
      <div>
        <h3 className="news-row__title">
          <SmartLink href={n.href}>{n.title}</SmartLink>
        </h3>
        <span className="news-row__date">{n.date}</span>
      </div>
    </article>
  );
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "hero":
      return (
        <section className="hero" key={i}>
          {b.slideshow.map((src, k) => (
            <div
              key={k}
              className={`hero__slide${b.slideshow.length === 1 ? " hero__slide--only" : ""}`}
              style={{ backgroundImage: `url(${src})`, animationDuration: `${(b.duration ?? 5000) * 2}ms` }}
            />
          ))}
          <div className="shell hero__inner">
            <h1 className="hero__title">{b.heading}</h1>
            <p className="hero__sub">{b.subheading}</p>
          </div>
        </section>
      );

    case "pageHero":
      return (
        <section
          className="page-hero"
          key={i}
          style={b.image ? { backgroundImage: `url(${b.image})` } : undefined}
        >
          <div className="shell page-hero__inner">
            {b.heading && <h1 className="page-hero__title">{b.heading}</h1>}
            {b.subheading && <p className="page-hero__sub">{b.subheading}</p>}
          </div>
        </section>
      );

    case "bandImage":
      return (
        <div
          className="band-image"
          key={i}
          style={b.image ? { backgroundImage: `url(${b.image})` } : undefined}
        />
      );

    case "text":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.kicker && <p className="h-kicker">{b.kicker}</p>}
            {b.heading &&
              (b.as === "h1" ? (
                <h1 className="h-sec">{b.heading}</h1>
              ) : (
                <h2 className="h-sec">{b.heading}</h2>
              ))}
            <div className={`prose${b.align === "center" ? " center" : ""}`}>
              {b.body?.map((p, k) => (
                <p key={k}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      );

    case "slogan":
      return (
        <div className="slogan" key={i}>
          <p>{b.text}</p>
        </div>
      );

    case "dateChange":
      return (
        <section className="section section--tight" key={i}>
          <div className="shell date-change">
            {b.kicker && <p className="date-change__kicker">{b.kicker}</p>}
            {b.heading && <h2 className="h-sec">{b.heading}</h2>}
            <div className="date-change__dates">
              {b.dates.map((d, k) => (
                <span key={k}>{d}</span>
              ))}
            </div>
          </div>
        </section>
      );

    case "banner":
      return (
        <section className="section section--tight" key={i}>
          <div className="shell banner">
            {b.kicker && <p className="banner__kicker">{b.kicker}</p>}
            <SmartLink href={b.href} className="banner__link">
              {b.text}
            </SmartLink>
          </div>
        </section>
      );

    case "split":
      return (
        <section className="section" key={i}>
          <div className="shell">
            <div className={`split${b.image ? "" : " split--wide-text"}`}>
              {b.image && b.imageSide === "right" && (
                <div className="split__media">
                  <Img src={b.image} alt={b.heading || ""} />
                </div>
              )}
              <div>
                {b.heading && <h2 className="h-sec">{b.heading}</h2>}
                <div className="prose">
                  {b.body.map((p, k) => (
                    <p key={k}>{p}</p>
                  ))}
                </div>
                {b.bullets && (
                  <ul className="bullets">
                    {b.bullets.map((p, k) => (
                      <li key={k}>{p}</li>
                    ))}
                  </ul>
                )}
                {b.extra && (
                  <div className="panel">
                    {b.extra.heading && <h3 className="panel__title">{b.extra.heading}</h3>}
                    {b.extra.body.map((p, k) => (
                      <p key={k}>{p}</p>
                    ))}
                  </div>
                )}
                {b.extra2 && (
                  <div className="panel">
                    {b.extra2.heading && <h3 className="panel__title">{b.extra2.heading}</h3>}
                    {b.extra2.body.map((p, k) => (
                      <p key={k}>{p}</p>
                    ))}
                  </div>
                )}
                {b.button && (
                  <div className="btn-row btn-row--left">
                    <Btn b={b.button} gold />
                  </div>
                )}
              </div>
              {b.image && b.imageSide !== "right" && (
                <div className="split__media">
                  <Img src={b.image} alt={b.heading || ""} />
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case "cards":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            <CardGrid items={b.items} columns={b.columns} plain={b.plain} showDate={b.showDate} />
          </div>
        </section>
      );

    case "socialFeed":
      return (
        <section className="section" key={i}>
          <div className="shell">
            <div className="social-feed">
              <div className="social-feed__card">
                <h4>Facebook</h4>
                <p>Connect with our community and follow the impact of our work.</p>
                <a
                  className="btn btn--solid"
                  href="https://www.facebook.com/maryjoyethiopia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow on Facebook
                </a>
              </div>
              <div className="social-feed__card">
                <h4>Instagram</h4>
                <p>See stories, photos and updates from Mary Joy Ethiopia.</p>
                <a
                  className="btn btn--solid"
                  href="https://www.instagram.com/mary_joy_ethiopia_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow on Instagram
                </a>
              </div>
            </div>
          </div>
        </section>
      );

    case "stats":
      return (
        <section className="section section--paper" key={i}>
          <div className="shell">
            <div className="stats">
              {b.items.map((s, k) => (
                <div key={k}>
                  <p className="stat__value">{s.value}</p>
                  <p className="stat__label">{s.label}</p>
                </div>
              ))}
            </div>
            {b.button && (
              <div className="btn-row">
                <Btn b={b.button} gold />
              </div>
            )}
          </div>
        </section>
      );

    case "buttonRow":
      return (
        <section className="section section--tight" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            {b.text && (
              <p className="center" style={{ margin: "0 0 10px" }}>
                {b.text}
              </p>
            )}
            <div className="btn-row">
              {b.buttons.map((btn, k) => (
                <Btn b={btn} gold={k === 0} key={k} />
              ))}
            </div>
          </div>
        </section>
      );

    case "quote":
      return (
        <section className="section section--paper" key={i}>
          <div className="shell quote">
            <p className="quote__text">
              {b.text}
              {b.italic && <em>{b.italic}</em>}
            </p>
            {b.author && <p className="quote__author">{b.author}</p>}
            {b.button && (
              <div className="btn-row">
                <Btn b={b.button} gold />
              </div>
            )}
          </div>
        </section>
      );

    case "pdfList":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            <ul className="pdf-list">
              {b.items.map((p) => (
                <li key={p.text}>
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    <FilePdf />
                    <span>
                      {p.text}
                      <small>PDF</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );

    case "gallery":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            {b.carousel ? (
              <div className="partners">
                {b.images.map((src, k) => (
                  <Img src={src} alt="" key={k} />
                ))}
              </div>
            ) : (
              <div className={`gallery gallery--${b.columns ?? 3}`}>
                {b.images.map((src, k) => (
                  <Img src={src} alt="" key={k} />
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "emptyGallery":
      return (
        <section className="section" key={i}>
          <div className="shell">
            <div className="gallery gallery-empty" />
          </div>
        </section>
      );

    case "list":
      return (
        <section className="section section--tight" key={i}>
          <div className="shell">
            <div className="list">
              {b.heading && (
                <h2 className="list__title">
                  {listIcon(b.icon)}
                  {b.heading}
                </h2>
              )}
              {b.numbered ? (
                <ol>
                  {b.items.map((t, k) => (
                    <li key={k}>{t}</li>
                  ))}
                </ol>
              ) : (
                <ul>
                  {b.items.map((t, k) => (
                    <li key={k}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      );

    case "infoList":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec">{b.heading}</h2>}
            <div>
              {b.items.map((r, k) => (
                <div className="info-list__row" key={k}>
                  <span className="info-list__label">{r.label}</span>
                  <span className="info-list__value">{r.value}</span>
                </div>
              ))}
            </div>
            {b.body?.map((p, k) => (
              <p key={k}>{p}</p>
            ))}
            {b.numbered && (
              <ol>
                {b.numbered.map((t, k) => (
                  <li key={k}>{t}</li>
                ))}
              </ol>
            )}
          </div>
        </section>
      );

    case "accordion":
      return (
        <section className="section" key={i}>
          <div className="shell">
            <Accordion
              heading={b.heading}
              heading2={b.heading2}
              items={b.items as FaqItem[]}
              firstOpen={b.firstOpen}
            />
          </div>
        </section>
      );

    case "table":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec">{b.heading}</h2>}
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    {b.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((r, k) => (
                    <tr key={k}>
                      {r.map((cell, m) => (
                        <td key={m}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );

    case "bankList":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            {b.subheading && (
              <p className="center" style={{ margin: "0 0 18px" }}>
                {b.subheading}
              </p>
            )}
            <ul className="bank-list">
              {b.items.map((t, k) => (
                <li key={k}>{t}</li>
              ))}
            </ul>
          </div>
        </section>
      );

    case "branches":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            {b.intro && (
              <p className="center" style={{ margin: "0 0 20px" }}>
                {b.intro}
              </p>
            )}
            {b.items.map((o, k) => (
              <div className="branch" key={k}>
                <span className="branch__name">{o.name}</span>
                <span className="branch__phone">{o.phone}</span>
              </div>
            ))}
          </div>
        </section>
      );

    case "offices":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            <div className="grid grid--3">
              {b.items.map((o, k) => (
                <div className="office" key={k}>
                  <h3 className="office__name">{o.name}</h3>
                  <p className="office__addr">{o.address}</p>
                  <p className="office__phone">{o.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "founder":
      return (
        <section className="section" key={i} id="governance">
          <div className="shell">
            <div className="founder">
              <Img src={b.image} alt={b.heading} />
              <div>
                <h2 className="h-sec">{b.heading}</h2>
                <p className="founder__intro">{b.intro}</p>
                {b.sections.map((s, k) => (
                  <div className="founder__sec" key={k}>
                    <h4>{s.heading}</h4>
                    {s.body.map((p, m) => (
                      <p key={m}>{p}</p>
                    ))}
                    {s.bullets && (
                      <ul className="bullets">
                        {s.bullets.map((p, m) => (
                          <li key={m}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );

    case "people":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            <div className={`grid grid--${b.columns ?? 3}`}>
              {b.items.map((p, k) => (
                <article className="person" key={k}>
                  <div className="person__media">
                    <Img src={p.image} alt={p.title} />
                  </div>
                  <div className="person__body">
                    {p.title && <h3 className="person__name">{p.title}</h3>}
                    {p.subtitle && <p className="person__role">{p.subtitle}</p>}
                    {p.text &&
                      p.text.split("\n\n").map((para, m) => <p className="person__text" key={m}>{para}</p>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case "timeline":
      return (
        <section className="section" key={i}>
          <div className="shell">
            <div className="timeline">
              {b.items.map((t, k) => (
                <article className="timeline__item" key={k}>
                  <Img src={t.image} alt="" />
                  <div className="timeline__body">
                    <p>{t.title}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case "anchorList":
      return (
        <section className="section section--paper" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            <div className="anchor-list">
              {b.items.map((a, k) => (
                <article className="anchor-card" key={k} id={a.anchor}>
                  <Img src={a.image} alt="" />
                  <div>
                    <h4>{a.title}</h4>
                    <p>{a.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case "featureGroup":
      return (
        <section className="section" key={i} id={b.anchor}>
          <div className="shell">
            <div className="feature">
              <h2 className="feature__title">{b.heading}</h2>
              {b.items.map((it, k) => (
                <div className="feature__item" key={k}>
                  {it.image ? (
                    <Img src={it.image} alt={it.title || ""} />
                  ) : (
                    <div />
                  )}
                  <div>
                    {it.title && <h4>{it.title}</h4>}
                    {it.bullets && (
                      <ul className="bullets">
                        {it.bullets.map((p, m) => (
                          <li key={m}>{p}</li>
                        ))}
                      </ul>
                    )}
                    {it.body?.map((p, m) => <p key={m}>{p}</p>)}
                    {it.story && (
                      <div className="story">
                        <h5 className="story__title">{it.story.heading}</h5>
                        {it.story.body.map((p, m) => (
                          <p key={m}>{p}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "embedForm":
      return (
        <section className="section" key={i} id={b.id}>
          <div className="shell">
            {b.title && <h2 className="embed__title">{b.title}</h2>}
            {b.subtitle && <p className="embed__sub">{b.subtitle}</p>}
            <div
              className={`embed${b.wide ? " embed--wide" : ""}`}
              style={
                b.bgImage
                  ? {
                      backgroundImage: `url(${b.bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      padding: 18,
                    }
                  : undefined
              }
            >
              {b.note && <p className="embed__note">{b.note}</p>}
              <iframe
                className="embed__frame"
                src={b.src}
                title={b.title || b.subtitle || "Form"}
                height={b.height}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      );

    case "contactForm":
      return (
        <section className="section" key={i}>
          <div className="shell">
            <div className="form-wrap">
              <h2 className="h-sec h-sec--center">{b.heading}</h2>
              <p className="center" style={{ margin: "0 0 24px" }}>
                {b.subheading}
              </p>
              <form>
                {b.fields.map((f, k) => (
                  <div className="form-field" key={k}>
                    <label htmlFor={`f-${i}-${k}`}>
                      {f.label}
                      {f.required ? " *" : ""}
                    </label>
                    {f.type === "textarea" ? (
                      <textarea id={`f-${i}-${k}`} name={f.label} required={f.required} />
                    ) : (
                      <input id={`f-${i}-${k}`} name={f.label} type={f.type} required={f.required} />
                    )}
                  </div>
                ))}
                <div className="btn-row">
                  <button type="submit" className="btn btn--gold">
                    {b.submitText}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      );

    case "map":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            <iframe className="map" src={b.src} title={b.heading || "Map"} loading="lazy" />
          </div>
        </section>
      );

    case "pdfViewer":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.src ? (
              <iframe className="pdf-viewer" src={b.src} title="Publication" loading="lazy" />
            ) : (
              <div className="gallery-empty" />
            )}
          </div>
        </section>
      );

    case "newsList":
      return (
        <section className="section" key={i}>
          <div className="shell">
            {b.heading && <h2 className="h-sec h-sec--center">{b.heading}</h2>}
            <div>
              {b.items.map((n, k) => (
                <NewsRow n={n} key={k} />
              ))}
            </div>
          </div>
        </section>
      );

    case "newsGrid":
      return (
        <section className="section" key={i}>
          <div className="shell">
            <div className="grid grid--3">
              {b.items.map((n, k) => (
                <article className="card" key={k}>
                  <div className="card__media">
                    <Img src={n.image} alt={n.title} />
                  </div>
                  <div className="card__body">
                    <h3 className="card__title">
                      <SmartLink href={n.href}>{n.title}</SmartLink>
                    </h3>
                    <div className="card__meta">
                      <span>{n.date}</span>
                      {n.author && <span>· {n.author}</span>}
                      <span>· No Comments</span>
                    </div>
                    {n.excerpt && <p className="card__text">{n.excerpt}</p>}
                    <SmartLink href={n.href} className="card__more">
                      Read More »
                    </SmartLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map(renderBlock)}</>;
}

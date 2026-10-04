import Link from "next/link";
import { ORG, SOCIALS, WHAT_WE_DO_LINKS } from "@/lib/site";
import { SocialIcon } from "@/components/Icons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div>
          <h2 className="footer__title">WHO WE ARE</h2>
          <p className="footer__text">
            Mary Joy strives to be a sustainable organization that brings about lasting improvement in
            the lives of its target groups.
          </p>

          <h3 className="footer__title">Contact</h3>
          <ul className="footer__contact">
            <li>{ORG.address}</li>
            {ORG.phones.map((p) => (
              <li key={p}>{p}</li>
            ))}
            <li>{ORG.email}</li>
          </ul>

          <h3 className="footer__title">Follow Us</h3>
          <div className="footer__social">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                <SocialIcon name={s.icon} size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="footer__title">WHAT WE DO</h2>
          <ul className="footer__links">
            {WHAT_WE_DO_LINKS.map((l) => (
              <li key={l}>{l}/</li>
            ))}
            <li>
              <Link href="/what-we-do/#whomweserve">Whom we serve</Link>
            </li>
            <li>
              <Link href="/what-we-do/#wherewework">Where we work</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="footer__title">DONATION</h2>
          <div className="footer-donate">
            <a className="btn btn--gold" href="sms:9600?body=OK">
              DONATE 1 BIRR
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="footer-qr"
              src="/uploads/2025/04/011dc49665658870d8a658c8260f925e.png"
              alt="SCAN ME QR CODE"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="shell">Copyright © 2026 Mary Joy Ethiopia</div>
      </div>
    </footer>
  );
}

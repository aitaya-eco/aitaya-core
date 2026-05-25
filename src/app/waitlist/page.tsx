"use client";

import { useState, useRef, FormEvent } from "react";
import Image from "next/image";
import styles from "./WaitlistPage.module.scss";
import PrimaryLogo from "../../../public/PNGs/attire_primary_logo.png";
import SecondaryLogo from "../../../public/PNGs/attire_secondary_logo.png";
import Background from "../../../components/Background";

type FormState = "idle" | "loading" | "success" | "error";
type NavKey = "HOME" | "EXPLORE" | "POST" | "CLOSET" | "PROFILE";

/* ─── Bottom nav rendered on every phone mockup ────────────────────────────── */
function PhoneNav({ active }: { active: NavKey }) {
  const items: { key: NavKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "HOME",
      label: "HOME",
      icon: <path d="M3 12L12 3l9 9M5 10v10h14V10" />,
    },
    {
      key: "EXPLORE",
      label: "EXPLORE",
      icon: (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </>
      ),
    },
    {
      key: "POST",
      label: "POST",
      icon: (
        <>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M12 8v8M8 12h8" />
        </>
      ),
    },
    {
      key: "CLOSET",
      label: "CLOSET",
      icon: <path d="M4 7l2-3h12l2 3M4 7v13h16V7M4 7h16M9 11h6" />,
    },
    {
      key: "PROFILE",
      label: "PROFILE",
      icon: (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
        </>
      ),
    },
  ];

  return (
    <nav className={styles.phoneNav} aria-hidden="true">
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <div
            key={item.key}
            className={`${styles.phoneNavItem} ${isActive ? styles.phoneNavItemActive : ""}`}
          >
            <div className={styles.phoneNavIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
            </div>
            <span className={styles.phoneNavLabel}>{item.label}</span>
            {isActive && <span className={styles.phoneNavDot} />}
          </div>
        );
      })}
    </nav>
  );
}

function PhoneFrame({
  children,
  activeNav,
}: {
  children: React.ReactNode;
  activeNav: NavKey;
}) {
  return (
    <div className={styles.phone} aria-hidden="true">
      <div className={styles.phoneScreen}>
        <div className={styles.phoneNotch} />
        <div className={styles.phoneStatusBar}>
          <span>9:41</span>
          <span>● ● ●</span>
        </div>
        <div className={styles.phoneContent}>{children}</div>
        <PhoneNav active={activeNav} />
      </div>
    </div>
  );
}

function SpecStrip({ left, right }: { left: string; right: string }) {
  return (
    <div className={styles.spec}>
      <span className={styles.specLabel}>{left}</span>
      <span className={styles.specRule} />
      <span className={styles.specLabel}>{right}</span>
    </div>
  );
}

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const heroFormRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || formState === "loading") return;

    setFormState("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormState("success");
        setMessage(data.message);
      } else {
        setFormState("error");
        setMessage(data.message ?? "Something went wrong.");
      }
    } catch {
      setFormState("error");
      setMessage("Network error. Please try again.");
    }
  }

  function scrollToTop() {
    heroFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setTimeout(() => inputRef.current?.focus(), 600);
  }

  return (
    <main className={styles.page}>
      <Background />

      <div className={styles.cornerCircles} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.logo}>
          <Image
            className={styles.primaryLogoImage}
            src={PrimaryLogo}
            alt="Attire"
            priority
          />
          <Image
            className={styles.secondaryLogoImage}
            src={SecondaryLogo}
            alt="Attire"
            priority
          />
        </div>

        <div className={styles.headline}>
          <p className={styles.tagline}>Your style is an evolution</p>
          <h1 className={styles.displayHeading}>Discover The Craft</h1>
        </div>

        <p className={styles.body}>
          A curated digital sanctuary for fashion visionaries. Build your
          wardrobe, commission bespoke, architect your next look.
        </p>

        <div ref={heroFormRef}>
          {formState === "success" ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✓</div>
              <p className={styles.successText}>You&apos;re on the list.</p>
              <p className={styles.successSub}>
                We&apos;ll be in touch when the doors open.
              </p>
              <div className={styles.communityButtons}>
                <a
                  href="https://chat.whatsapp.com/DqAelICKYU8ICM5VpVNflI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.button} ${styles.whatsappButton}`}
                >
                  Join Us On WhatsApp
                </a>
                <a
                  href="https://t.me/+BmlcB3HQ-TAzM2E0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.button} ${styles.telegramButton}`}
                >
                  Join Us On Telegram
                </a>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.inputWrapper}>
                <input
                  ref={inputRef}
                  className={`${styles.input} ${formState === "error" ? styles.inputError : ""}`}
                  type="email"
                  placeholder="Add Your Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formState === "error") {
                      setFormState("idle");
                      setMessage("");
                    }
                  }}
                  required
                  autoComplete="email"
                  aria-label="Email address"
                />
                <span className={styles.inputLine} aria-hidden="true" />
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={formState === "loading"}
              >
                {formState === "loading" ? (
                  <span className={styles.buttonSpinner} aria-hidden="true" />
                ) : (
                  <span className={styles.buttonText}>Join the Wait</span>
                )}
              </button>

              {message && (
                <p
                  className={`${styles.message} ${
                    formState === "error" ? styles.error : styles.success
                  }`}
                  role="alert"
                >
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* SPREAD I — WARDROBE */}
      <section className={styles.section}>
        <SpecStrip left="Feature No. I · The Wardrobe" right="For the curator" />
        <div className={styles.spread}>
          <div className={styles.spreadCopy}>
            <div className={styles.spreadNum}>01.</div>
            <p className={styles.spreadEyebrow}>A living archive</p>
            <h2 className={styles.spreadHeading}>
              Your wardrobe,
              <br />
              <em>finally</em> in your pocket.
            </h2>
            <div className={styles.spreadBody}>
              <p>
                Scan every piece. Attire reads silhouette, fabric, and colour
                — and quietly remembers when each was last worn.
              </p>
              <p>
                Plan tomorrow&apos;s fit before you sleep. Build outfits from
                what is clean. Stop buying things you already own.
              </p>
            </div>
          </div>

          <PhoneFrame activeNav="CLOSET">
            <div className={styles.wHdr}>
              <span>←</span>
              <span className={styles.wTitle}>MY WARDROBE</span>
              <span>⌕</span>
            </div>
            <div className={styles.wStats}>
              <div className={styles.wStat}>
                <div className={styles.wStatN}>47</div>
                <div className={styles.wStatL}>TOTAL</div>
              </div>
              <div className={styles.wStat}>
                <div className={styles.wStatN}>41</div>
                <div className={styles.wStatL}>CLEAN</div>
              </div>
              <div className={styles.wStat}>
                <div className={`${styles.wStatN} ${styles.wStatAlert}`}>6</div>
                <div className={styles.wStatL}>LAUNDRY</div>
              </div>
            </div>
            <div className={styles.wCats}>
              <span className={`${styles.wCat} ${styles.wCatSel}`}>All</span>
              <span className={styles.wCat}>Tops</span>
              <span className={styles.wCat}>Dresses</span>
              <span className={styles.wCat}>Outer</span>
            </div>
            <div className={styles.wGrid}>
              <div className={`${styles.wItem} ${styles.w1}`} />
              <div className={`${styles.wItem} ${styles.w2}`} />
              <div className={`${styles.wItem} ${styles.w3}`}>
                <span className={styles.wLaundry} />
              </div>
              <div className={`${styles.wItem} ${styles.w4}`} />
              <div className={`${styles.wItem} ${styles.w5}`} />
              <div className={`${styles.wItem} ${styles.w6}`}>
                <span className={styles.wLaundry} />
              </div>
            </div>
            <div className={styles.wScan}>+ SCAN NEW PIECE</div>
          </PhoneFrame>
        </div>
      </section>

      {/* SPREAD II — EXPLORE */}
      <section className={styles.section}>
        <SpecStrip left="Feature No. II · Explore" right="Inspiration, curated" />
        <div className={`${styles.spread} ${styles.spreadFlip}`}>
          <PhoneFrame activeNav="EXPLORE">
            <div className={styles.eHdr}>
              <span className={styles.eTitle}>Explore</span>
              <span style={{ fontSize: 14 }}>⌥</span>
            </div>
            <div className={styles.eSearch}>
              <div className={styles.eSearchBar}>
                ⌕ &nbsp; Search styles, tailors, niches…
              </div>
            </div>
            <div className={styles.ePills}>
              <span className={`${styles.ePill} ${styles.ePillSel}`}>For You</span>
              <span className={styles.ePill}>Adire</span>
              <span className={styles.ePill}>Bridal</span>
              <span className={styles.ePill}>Streetwear</span>
            </div>
            <div className={styles.eTrending}>— TRENDING IN LAGOS</div>
            <div className={styles.eGrid}>
              <div className={`${styles.eCard} ${styles.w2}`}>
                <span className={styles.eFire}>↗ HOT</span>
                <span className={styles.eTag}>Aso-oke modern · 2.4k saves</span>
              </div>
              <div className={`${styles.eCard} ${styles.w4}`}>
                <span className={styles.eTag}>Bridal Adire · @amaka.studio</span>
              </div>
            </div>
            <div className={styles.eRow}>
              <div className={`${styles.eMini} ${styles.w3}`}>
                <span className={styles.eMiniLabel}>Suits</span>
              </div>
              <div className={`${styles.eMini} ${styles.w5}`}>
                <span className={styles.eMiniLabel}>Agbada</span>
              </div>
              <div className={`${styles.eMini} ${styles.w1}`}>
                <span className={styles.eMiniLabel}>Street</span>
              </div>
            </div>
          </PhoneFrame>

          <div className={styles.spreadCopy}>
            <div className={styles.spreadNum}>02.</div>
            <p className={styles.spreadEyebrow}>A curated feed</p>
            <h2 className={styles.spreadHeading}>
              Discover
              <br />
              what&apos;s <em>next</em>.
            </h2>
            <div className={styles.spreadBody}>
              <p>
                Not an algorithm chasing engagement. A salon hand-curated for
                taste — trending niches in your city, rising tailors, weekly
                drops.
              </p>
              <p>
                Tap any look to break it apart, save what moves you to a mood
                board, or commission the piece directly from the maker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPREAD III — RECREATE */}
      <section className={styles.section}>
        <SpecStrip
          left="Feature No. III · Recreate"
          right="Inspiration to instruction"
        />
        <div className={styles.spread}>
          <div className={styles.spreadCopy}>
            <div className={styles.spreadNum}>03.</div>
            <p className={styles.spreadEyebrow}>Inspiration, mapped</p>
            <h2 className={styles.spreadHeading}>
              See a look.
              <br />
              <em>Recreate</em> the look.
            </h2>
            <div className={styles.spreadBody}>
              <p>
                Tap any image — a runway, a post, a passing stranger. Attire
                breaks the silhouette into pieces and matches them against
                your wardrobe.
              </p>
              <p>
                What you have, marked. What you need, suggested — drawn from
                the same tailors who built the original.
              </p>
            </div>
          </div>

          <PhoneFrame activeNav="HOME">
            <div className={styles.rOrig}>
              <span className={styles.rTag}>INSPIRATION</span>
            </div>
            <p className={styles.rLabel}>FROM YOUR WARDROBE</p>
            <div className={styles.rMatch}>
              <div className={`${styles.rPiece} ${styles.w2}`}>
                <span className={styles.rBadge}>✓</span>
              </div>
              <div className={`${styles.rPiece} ${styles.w3}`}>
                <span className={styles.rBadge}>✓</span>
              </div>
              <div className={`${styles.rPiece} ${styles.w1}`}>
                <span className={`${styles.rBadge} ${styles.rBadgeNo}`}>!</span>
              </div>
            </div>
            <div className={styles.rMissing}>
              <div className={styles.rMissH}>— MISSING TO COMPLETE</div>
              <div className={styles.rSug}>
                <div className={styles.rSugItem}>
                  <div className={`${styles.rSugImg} ${styles.w5}`} />
                  <div className={styles.rSugName}>
                    Gold scarf
                    <br />
                    <span className={styles.rSugMuted}>Adire Studio</span>
                  </div>
                </div>
                <div className={styles.rSugItem}>
                  <div className={`${styles.rSugImg} ${styles.w6}`} />
                  <div className={styles.rSugName}>
                    Black mules
                    <br />
                    <span className={styles.rSugMuted}>Bola Couture</span>
                  </div>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </section>

      {/* SPREAD IV — ATELIER */}
      <section className={styles.section}>
        <SpecStrip left="Feature No. IV · The Atelier" right="For the makers" />
        <div className={`${styles.spread} ${styles.spreadFlip}`}>
          <PhoneFrame activeNav="PROFILE">
            <div className={styles.tCover}>
              <span className={styles.tBadge}>✓ VERIFIED TAILOR</span>
            </div>
            <p className={styles.tName}>Bola Adeyemi Couture</p>
            <p className={styles.tSpec}>Lekki Phase 1 · Bridal &amp; Asoebi</p>
            <div className={styles.esc}>
              <div className={styles.escRow}>
                <span className={styles.escStep}>
                  <span className={`${styles.dot} ${styles.dotDone}`} />
                  Deposit secured
                </span>
                <span className={styles.escAmt}>₦40,000</span>
              </div>
              <div className={styles.escRow}>
                <span className={styles.escStep}>
                  <span className={`${styles.dot} ${styles.dotDone}`} />
                  Fabric approved
                </span>
                <span className={styles.escAmt}>₦25,000</span>
              </div>
              <div className={styles.escRow}>
                <span className={styles.escStep}>
                  <span className={`${styles.dot} ${styles.dotNow}`} />
                  First fitting
                </span>
                <span className={styles.escAmt}>₦35,000</span>
              </div>
              <div className={styles.escRow}>
                <span className={styles.escStep}>
                  <span className={styles.dot} />
                  Final delivery
                </span>
                <span className={`${styles.escAmt} ${styles.escAmtMuted}`}>
                  ₦50,000
                </span>
              </div>
            </div>
            <div className={styles.escFoot}>Escrow protected · ₦150,000</div>
          </PhoneFrame>

          <div className={styles.spreadCopy}>
            <div className={styles.spreadNum}>04.</div>
            <p className={styles.spreadEyebrow}>A workshop, not a shelf</p>
            <h2 className={styles.spreadHeading}>
              The tailor
              <br />
              gets <em>paid</em>.
            </h2>
            <div className={styles.spreadBody}>
              <p>
                Every commission moves through milestone escrow. Funds release
                when the fitting is approved, the panel is cut, the piece is
                delivered.
              </p>
              <p>
                No ghosted deposits. No half-finished bridal. Just clean
                transactions between people who respect each other&apos;s
                time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRIPTYCH */}
      <section className={styles.section}>
        <SpecStrip left="The House" right="One salon · Three doors" />
        <h2 className={styles.triHeading}>Who walks in.</h2>
        <p className={styles.triSub}>
          Whichever entrance you take, the room behind it already knows your
          name.
        </p>
        <div className={styles.doors}>
          <div className={styles.door}>
            <p className={styles.doorRoman}>I.</p>
            <p className={styles.doorTag}>The Curator</p>
            <h3 className={styles.doorHeading}>
              Architect
              <br />
              the look.
            </h3>
            <p className={styles.doorBody}>
              For the wearer with taste. Build the wardrobe, plan the week,
              commission what&apos;s missing.
            </p>
          </div>
          <div className={styles.door}>
            <p className={styles.doorRoman}>II.</p>
            <p className={styles.doorTag}>The Tailor</p>
            <h3 className={styles.doorHeading}>
              Present
              <br />
              the craft.
            </h3>
            <p className={styles.doorBody}>
              For the maker. Verified profile, structured briefs, milestone
              escrow on every commission.
            </p>
          </div>
          <div className={styles.door}>
            <p className={styles.doorRoman}>III.</p>
            <p className={styles.doorTag}>The Creator</p>
            <h3 className={styles.doorHeading}>
              Monetise
              <br />
              the voice.
            </h3>
            <p className={styles.doorBody}>
              For the tastemaker. Verified tiers, sponsored tools, a brand
              marketplace built for fashion.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className={styles.closing}>
        <p className={styles.closingMark}>Founding Access · 2026</p>
        <h2 className={styles.displayHeading}>Step into the salon.</h2>
        <p className={styles.body}>
          You have seen the rooms. The waitlist sits at the door — every name
          shapes what Attire becomes.
        </p>
        <button
          type="button"
          className={styles.returnButton}
          onClick={scrollToTop}
        >
          <span>↑</span> Return to the salon
        </button>
      </section>
    </main>
  );
}

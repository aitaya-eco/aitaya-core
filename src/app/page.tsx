import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";
import DesktopLogo from "../../public/PNGs/attire_primary_logo.png"; // Using your SVGR setup
import Background from "../../public/PNGs/paper.png";
import WaitlistPage from "./waitlist/page";

export default function HomePage() {
  return (
    <main className={styles.container}>
      {/* Background Texture (Reusing your texture logic) */}
      <Image
        className={styles.backgroundImage}
        src={Background}
        alt="Background Texture"
        priority
      />

      {/* Radial vignette */}
      <div className={styles.vignette} aria-hidden="true" />

      <section className={styles.hero}>
        <div className={styles.logoWrapper}>
          <Image
            className={styles.logo}
            src={DesktopLogo}
            alt="Background Texture"
            priority
          />
        </div>

        <h1 className={styles.title}>
          Your style is an <span>Evolution</span>
        </h1>

        <p className={styles.subtitle}>
          The digital home for the modern curator. The Private Salon is
          currently by invitation only.
        </p>

        <Link href="/waitlist" className={styles.button}>
          Enter The Salon
        </Link>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 ATTIRE. All rights reserved.</p>
      </footer>
    </main>
  );
}

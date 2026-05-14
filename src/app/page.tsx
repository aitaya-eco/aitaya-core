import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";
import DesktopLogo from "../../public/PNGs/attire_primary_logo.png";
import Background from "../../components/Background";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <Background />

      {/* Decorative corner circles borrowed from the Waitlist page */}
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

      {/* The card wrapper initiates the base fadeUp animation */}
      <section className={styles.card}>
        <div className={styles.logoWrapper}>
          <Image
            className={styles.logo}
            src={DesktopLogo}
            alt="Attire Logo"
            priority
          />
        </div>

        <div className={styles.headline}>
          <h1 className={styles.title}>
            Your style is an <span>Evolution</span>
          </h1>
        </div>

        <p className={styles.subtitle}>
          The digital home for the modern curator. The Private Salon is
          currently by invitation only.
        </p>

        {/* Action wrapper keeps the button constrained similarly to the form */}
        <div className={styles.actionWrapper}>
          <Link href="/waitlist" className={styles.button}>
            Enter The Salon
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 ATTIRE. All rights reserved.</p>
      </footer>
    </main>
  );
}
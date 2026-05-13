"use client";

import { useState, useRef, FormEvent } from "react";
import styles from "./WaitlistPage.module.scss";
import Image from "next/image";
import PrimaryLogo from "../../../public/PNGs/attire_primary_logo.png";
import SecondaryLogo from "../../../public/PNGs/attire_secondary_logo.png";
import Background from "../../../public/PNGs/paper.png";

type FormState = "idle" | "loading" | "success" | "error";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <main className={styles.page}>
      
      {/* Background Texture (Reusing your texture logic) */}
      <Image
        className={styles.backgroundImage}
        src={Background}
        alt="Background Texture"
        priority
      />

      {/* Decorative grain texture */}
      <div className={styles.grain} aria-hidden="true" />

      {/* Radial vignette */}
      <div className={styles.vignette} aria-hidden="true" />

      {/* Corner circle ornaments */}
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

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <Image
            className={styles.primaryLogoImage}
            src={PrimaryLogo}
            alt="Attire Logo"
          />
          <Image
            className={styles.secondaryLogoImage}
            src={SecondaryLogo}
            alt="Attire Logo"
          />
        </div>

        {/* Headlines */}
        <div className={styles.headline}>
          <p className={styles.tagline}>Your style is an evolution</p>
          <h1 className={styles.displayHeading}>Discover The Craft</h1>
        </div>

        {/* Body copy */}
        <p className={styles.body}>
          A curated digital sanctuary for fashion visionaries. Explore the
          architectural beauty of bespoke garments, build your mood boards, and
          architect your next look.
        </p>

        {/* Form or success */}
        {formState === "success" ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.successText}>You&apos;re on the list.</p>
            <p className={styles.successSub}>
              We&apos;ll be in touch when the doors open.
            </p>
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
                aria-describedby={message ? "form-message" : undefined}
              />
              <span className={styles.inputLine} aria-hidden="true" />
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={formState === "loading"}
              aria-busy={formState === "loading"}
            >
              {formState === "loading" ? (
                <span className={styles.buttonSpinner} aria-hidden="true" />
              ) : (
                <span className={styles.buttonText}>Join the Wait</span>
              )}
            </button>

            {message && (
              <p
                id="form-message"
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
    </main>
  );
}

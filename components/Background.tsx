"use client"; // Required in Next.js App Router for stateful components

import { useState } from "react";
import Image from "next/image";
import BackgroundImage from "../public/PNGs/paper.png";
import styles from "./Background.module.scss";

export default function Background() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={styles.backgroundContainer}>
      {/* Radial vignette */}
      <div className={styles.vignette} aria-hidden="true" />

      {/* Background Texture (Reusing your texture logic) */}
      <Image
        src={BackgroundImage}
        alt="Website Background"
        fill // Tells Next.js to expand the image to fill the parent div
        // quality={85} // Optimizes file size further (default is 75)
        className={`${styles.backgroundImage} ${isLoaded ? styles.loaded : ""}`}
        onLoad={() => setIsLoaded(true)} // Triggers the fade-in once downloaded

        /* 
          IMPORTANT PRO TIP: 
          If this background is the very first thing users see above the fold, 
          uncomment the line below. It tells Next.js NOT to lazy-load it, 
          which improves your Core Web Vitals (LCP). 
        */
        // priority={true}
      />
      {/* Background Texture (Reusing your texture logic) */}
    </div>
  );
}

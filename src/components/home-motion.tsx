"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* One small client component powers all homepage animations:
   hero entrance, reveal-on-scroll, floating cards and the scan line. */
export function HomeMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero] > *", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "opacity,transform",
      });

      gsap.from("[data-hero-art]", {
        opacity: 0,
        x: 24,
        y: 16,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
        clearProps: "opacity,transform",
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 28,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
          clearProps: "opacity,transform",
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.from(Array.from(group.children), {
          opacity: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
          clearProps: "opacity,transform",
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((element, index) => {
        // Start from rest with a positive delay. A negative delay makes GSAP
        // jump to a mid-cycle position on the first frame, which looks jerky.
        const delay = Number(element.dataset.floatDelay ?? 0.6 + index * 0.3);

        gsap.to(element, {
          y: -6,
          duration: 7.5 + index * 0.9,
          delay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          force3D: true,
        });
      });

      const scan = document.querySelector<HTMLElement>("[data-scan]");

      if (scan) {
        gsap.fromTo(
          scan,
          { top: "30%", opacity: 0.2 },
          {
            top: "68%",
            opacity: 1,
            duration: 1.7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      }
    });

    return () => motion.revert();
  }, []);

  return null;
}

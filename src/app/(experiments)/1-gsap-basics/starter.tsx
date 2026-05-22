"use client";

import { use, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      SplitText.create(".title", {
        type: "words, chars",
        charsClass: "letter",
      });
      gsap.from(".title .letter", {
        y: 300,
        opacity: 0,
        ease: "circ.out",
        stagger: 0.03,
      });
    },
    {
      scope: containerRef,
    },
  );

  return (
    <div className="bg-blue-300 text-black">
      <div
        ref={containerRef}
        className="flex h-screen items-end justify-left overflow-hidden"
      >
        <h1 className="title font-black text-[min(20rem,30vw)] leading-none pb-[0.1em] text-left">
          GSAP
          <br />
          tweens
        </h1>
      </div>
    </div>
  );
}

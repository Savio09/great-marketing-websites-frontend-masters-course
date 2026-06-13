"use client";

import s from "./styles.module.css";
import { useEffect, useRef } from "react";

export default function Page() {
  const mouseRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "mousemove",
      (event) => {
        const x = event.clientX;
        const y = event.clientY;

        if (mouseRef.current) {
          mouseRef.current.style.setProperty("--x", x.toString() + "px");
          mouseRef.current.style.setProperty("--y", y.toString() + "px");
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  });
  return (
    <div className="w-screen h-screen bg-black text-green-400 flex items-center justify-center">
      <h1 className="uppercase text-[10vh] leading-none relative cursor-default pl-[0.1em] opacity-60 hover:opacity-100">
        Start
      </h1>
      <div ref={mouseRef} className={s.cursor} />
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import s from "./styles.module.css";

import { useEffect } from "react";
import { distance } from "@/lib/math";

export default function Page() {
  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "mousemove",
      (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;

        const d = distance(centerX, centerY, mouseX, mouseY);
        const maxDist = distance(0, 0, centerX, centerY);

        console.log(d / maxDist);
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, []);
  return (
    <div
      className={cn(
        "w-screen h-screen text-white flex items-center justify-center",
        s.grid,
      )}
    >
      <h1
        className={cn(
          "uppercase text-[10vh] leading-none relative",
          s["title"],
        )}
      >
        Variables
      </h1>
    </div>
  );
}

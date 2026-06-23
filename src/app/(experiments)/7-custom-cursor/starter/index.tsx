"use client";

import { lerp } from "three/src/math/MathUtils.js";
import s from "./styles.module.css";
import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";

export default function Page() {
  const mouseRef = useRef<HTMLDivElement>(null);

  const cursorPosRef = useRef({
    x: 0,
    y: 0,
  });

  const cursorTargetRef = useRef({
    x: 0,
    y: 0,
  });

  const [snap, setSnap] = useState<null | {
    x: number;
    y: number;
    w: number;
    h: number;
  }>(null);

  useEffect(() => {
    const cb = () => {
      if (snap) {
        cursorPosRef.current.x = lerp(cursorPosRef.current.x, snap.x, 0.1);
        cursorPosRef.current.y = lerp(cursorPosRef.current.y, snap.y, 0.1);
      } else {
        cursorPosRef.current.x = lerp(
          cursorPosRef.current.x,
          cursorTargetRef.current.x,
          0.1,
        );
        cursorPosRef.current.y = lerp(
          cursorPosRef.current.y,
          cursorTargetRef.current.y,
          0.1,
        );
      }

      if (mouseRef.current) {
        mouseRef.current.style.setProperty(
          "--x",
          cursorPosRef.current.x.toString() + "px",
        );
        mouseRef.current.style.setProperty(
          "--y",
          cursorPosRef.current.y.toString() + "px",
        );
      }
    };

    gsap.ticker.add(cb);

    return () => {
      gsap.ticker.remove(cb);
    };
  }, [snap]);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "mousemove",
      (event) => {
        const x = event.clientX;
        const y = event.clientY;

        if (mouseRef.current) {
          // mouseRef.current.style.setProperty("--x", x.toString() + "px");
          // mouseRef.current.style.setProperty("--y", y.toString() + "px");
          cursorTargetRef.current.x = x;
          cursorTargetRef.current.y = y;
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  });

  const onPointerEnter = useCallback((e: PointerEvent) => {
    const rect = e.currentTarget.getClientRects()[0];
    console.log(rect);
    setSnap({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      w: rect.width,
      h: rect.height,
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    setSnap(null);
  }, []);

  return (
    <div className="w-screen h-screen bg-black text-green-400 flex items-center justify-center">
      <h1
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        className="uppercase text-[10vh] leading-none relative cursor-default pl-[0.1em] opacity-60 hover:opacity-100"
      >
        Start
      </h1>
      <div
        ref={mouseRef}
        className={s.cursor}
        style={
          {
            "--w": snap ? snap.w + "px" : undefined,
            "--h": snap ? snap.h + "px" : undefined,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

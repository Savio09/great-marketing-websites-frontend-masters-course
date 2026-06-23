"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import { useEffect } from "react";
import { fitContent, remap } from "@/lib/math";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useGSAP(
    () => {
      SplitText.create("h1", {
        type: "chars",
        charsClass:
          "char++ bg-linear-to-t from-black/10 to-white to-70% bg-clip-text",
        mask: "chars",
      });

      gsap.from("h1 .char", {
        x: "100%",
        rotateY: "90deg",
        stagger: 0.02,
        duration: 0.5,
        ease: "circ.out",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.to(progressRef, {
        current: 1,
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="h-[400vh]">
      <ScrollSequence progress={progressRef} />
      <div className="relative w-full overflow-clip">
        <section className="title h-screen fixed w-full">
          <h1 className="uppercase absolute text-[8vw] w-full text-center -bottom-[0.1em] leading-none right-[0.05em] tracking-widest text-transparent">
            Perseverance
          </h1>
        </section>
        <section className="cameras fixed h-screen w-full top-0 left-0 opacity-100">
          <div className="absolute top-1/2 -translate-y-1/2 right-10 max-w-full w-md text-white">
            <h2 className="text-6xl mb-2">Cameras</h2>
            <p className="text-balance">
              Mounted on the &quot;head&quot; of the rover&apos;s long-necked
              mast. The SuperCam on the Perseverance rover examines rocks and
              soils with a camera, laser, and spectrometers to seek chemical
              materials that could be related to past life on Mars.
            </p>
          </div>
        </section>
        <section className="wheels fixed h-screen w-full opacity-100">
          <div className="absolute bottom-10 left-16 max-w-full w-md text-white">
            <h2 className="text-6xl mb-2">Wheels</h2>
            <p className="text-balance">
              The wheels are made of aluminium, with cleats for traction and
              curved titanium spokes for springy support.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function ScrollSequence({ progress }: { progress: React.RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const images: Record<number, HTMLImageElement> = {};

    for (let i = 0; i < 300; i++) {
      const image = new Image();
      image.src = `/sequence/${(i + 1).toString().padStart(4, "0")}.webp`;
      image.onload = () => {
        images[i + 1] = image;
      };
    }

    const cb = gsap.ticker.add(() => {
      if (!canvas || !ctx) return;
      let frameNumber = Math.round(remap(progress.current, 0, 1, 1, 300));
      let image = images[frameNumber];

      if (!image) return;
      const { x, y, width, height } = fitContent(
        canvas.width,
        canvas.height,
        image.width,
        image.height,
      );
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, x, y, width, height);
    });

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(cb);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />;
}

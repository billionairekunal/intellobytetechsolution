"use client";
import { motion, useInView, useMotionValue, useSpring, animate, type HTMLMotionProps } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { Star } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Intellobyte Toys — home" className="group inline-flex items-center gap-2">
      <span className="relative grid size-9 place-items-center rounded-full bg-rose text-white shadow-[0_6px_20px_-6px_var(--color-rose)] transition-transform duration-500 group-hover:rotate-[20deg]">
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
          <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.1.2.5.2.6 0 .7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21Z" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-lime ring-2 ring-porcelain" />
      </span>
      <span className={`display text-[1.45rem] leading-none font-semibold ${light ? "text-white" : "text-ink"}`}>
        intello<em className="font-normal text-rose">byte</em>
        <span className={`ml-1.5 hidden align-middle font-sans sm:inline text-[0.55rem] font-extrabold tracking-[0.25em] ${light ? "text-lilac" : "text-muted"}`}>TOYS</span>
      </span>
    </Link>
  );
}

/** Fade/slide content in once it scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, className, ...rest }: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Headline that rises in word by word. */
export function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 6 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Button that leans toward the cursor. */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  return (
    <motion.div
      className={`inline-block ${className ?? ""}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, {
      duration: 2, ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = v.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + suffix; },
    });
    return () => c.stop();
  }, [inView, to, suffix, decimals]);
  return <span ref={ref}>0{suffix}</span>;
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? "fill-rose text-rose" : "fill-transparent text-ink/20"} />
      ))}
    </span>
  );
}

export function Marquee({ children, className, reverse }: { children: ReactNode; className?: string; reverse?: boolean }) {
  return (
    <div className={`flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] ${className ?? ""}`}>
      <div className={`flex w-max shrink-0 animate-marquee items-center hover:[animation-play-state:paused] ${reverse ? "[animation-direction:reverse]" : ""}`}>
        {children}
        {children}
      </div>
    </div>
  );
}

export function SectionHead({ kicker, title, accent, sub, light }: { kicker: string; title: string; accent?: string; sub?: string; light?: boolean }) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <p className={`mb-3 inline-flex items-center gap-2 text-[0.7rem] font-extrabold tracking-[0.28em] uppercase ${light ? "text-lilac" : "text-rose"}`}>
          <span className="h-px w-8 bg-current" /> {kicker}
        </p>
      </Reveal>
      <h2 className={`display text-4xl leading-[1.02] font-medium sm:text-5xl lg:text-6xl ${light ? "text-white" : "text-ink"}`}>
        <SplitText text={title} />
        {accent && <em className="text-gradient font-normal"><SplitText text={accent} delay={0.25} /></em>}
      </h2>
      {sub && <Reveal delay={0.2}><p className={`mt-4 max-w-lg text-base ${light ? "text-white/65" : "text-muted"}`}>{sub}</p></Reveal>}
    </div>
  );
}

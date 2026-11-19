"use client";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Home, LayoutGrid, Menu, Minus, Plus, Search, ShieldCheck, ShoppingBag, Truck, User, X } from "lucide-react";
import Lenis from "lenis";
import { useStore } from "./store";
import { Logo, Marquee } from "./ui";
import { FREE_SHIP, inr } from "@/lib/format";

const NAV = [
  { href: "/shop?t=her", label: "For Her" },
  { href: "/shop?t=him", label: "For Him" },
  { href: "/shop?t=couples", label: "Couples" },
  { href: "/shop?c=smart", label: "Smart Toys" },
  { href: "/shop?t=luxe", label: "Luxe" },
  { href: "/quiz", label: "Find Your Match" },
];

export function SmoothScroll() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let id = requestAnimationFrame(function raf(t) { lenis.raf(t); id = requestAnimationFrame(raf); });
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [path]);
  return null;
}

export function Header() {
  const { cart, wish, setOpen, ready } = useStore();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const path = usePathname();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
    setSolid(y > 30);
  });
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close overlays on navigation
  useEffect(() => { setMenu(false); setSearch(false); }, [path]);
  const count = ready ? cart.reduce((s, i) => s + i.qty, 0) : 0;

  return (
    <>
      <div className="bg-ink py-2 text-[0.72rem] font-semibold tracking-wide text-white/80">
        <Marquee>
          {["Free discreet delivery over " + inr(FREE_SHIP), "Plain box · no logos · no product names", "Cash on delivery across India", "Use WELCOME10 for 10% off your first order", "100% body-safe · authentic brands", "Strictly 18+"].map((t) => (
            <span key={t} className="mx-8 inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-lime" />{t}</span>
          ))}
        </Marquee>
      </div>

      <motion.header
        animate={{ y: hidden && !menu ? "-110%" : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 px-3 pt-3 sm:px-5"
      >
        <div className={`mx-auto flex max-w-7xl items-center gap-2 rounded-full border px-3 py-2.5 sm:gap-4 transition-all duration-500 sm:px-6 ${solid ? "border-ink/5 bg-white/80 shadow-[0_10px_40px_-20px_rgba(20,10,24,.35)] backdrop-blur-xl" : "border-white/40 bg-white/75 backdrop-blur-md"}`}>
          <button className="-ml-1 rounded-full p-2 lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={20} /></button>
          <Logo />
          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="group relative rounded-full px-3.5 py-2 text-sm font-semibold text-ink/75 transition-colors hover:text-ink">
                {n.label}
                <span className="absolute inset-x-3.5 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-rose transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            ))}
            <Link href="/shop?t=sale" className="ml-1 rounded-full bg-rose px-3.5 py-1.5 text-sm font-bold text-white transition hover:bg-rose-deep">Sale</Link>
          </nav>
          <div className="ml-auto flex items-center gap-0.5">
            <IconBtn label="Search" onClick={() => setSearch(true)}><Search size={19} /></IconBtn>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden rounded-full p-2.5 transition hover:bg-ink/5 sm:block">
              <Heart size={19} />
              {ready && wish.length > 0 && <Badge n={wish.length} />}
            </Link>
            <Link href="/account" aria-label="Account" className="hidden rounded-full p-2.5 transition hover:bg-ink/5 sm:block"><User size={19} /></Link>
            <button onClick={() => setOpen(true)} aria-label="Open cart" className="relative ml-1 flex items-center gap-2 rounded-full bg-ink py-2 pr-3.5 pl-3 text-sm font-bold text-white transition hover:bg-plum-2">
              <ShoppingBag size={17} />
              <motion.span key={count} initial={{ scale: 1.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>{count}</motion.span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{menu && <MobileMenu onClose={() => setMenu(false)} />}</AnimatePresence>
      <AnimatePresence>{search && <SearchOverlay onClose={() => setSearch(false)} />}</AnimatePresence>
    </>
  );
}

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return <button onClick={onClick} aria-label={label} className="rounded-full p-2.5 transition hover:bg-ink/5">{children}</button>;
}
function Badge({ n }: { n: number }) {
  return <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-rose text-[0.6rem] font-bold text-white">{n}</span>;
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ clipPath: "circle(0% at 8% 4%)" }} animate={{ clipPath: "circle(150% at 8% 4%)" }} exit={{ clipPath: "circle(0% at 8% 4%)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="grain fixed inset-0 z-50 overflow-y-auto bg-plum px-6 py-6 text-white">
      <div className="flex items-center justify-between">
        <Logo light />
        <button onClick={onClose} aria-label="Close menu" className="rounded-full bg-white/10 p-2.5"><X size={20} /></button>
      </div>
      <nav className="mt-12 flex flex-col gap-1">
        {[{ href: "/shop", label: "Shop All" }, ...NAV, { href: "/shop?t=sale", label: "Sale" }, { href: "/wishlist", label: "Wishlist" }, { href: "/account", label: "My Account" }].map((n, i) => (
          <motion.div key={n.href} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <Link href={n.href} className="display block border-b border-white/10 py-3 text-3xl hover:text-lime">{n.label}</Link>
          </motion.div>
        ))}
      </nav>
      <p className="mt-10 flex items-center gap-2 text-sm text-white/60"><ShieldCheck size={16} className="text-lime" /> Discreet packaging on every order.</p>
    </motion.div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-md" onClick={onClose}>
      <motion.form
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/shop?q=${encodeURIComponent(q.trim())}`); }}
        className="mx-auto mt-24 max-w-2xl px-4"
      >
        <div className="flex items-center gap-3 rounded-full bg-white px-6 py-4 shadow-2xl">
          <Search className="text-rose" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search toys, brands, vibes…" className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted" aria-label="Search products" />
          <button type="button" onClick={onClose} aria-label="Close search" className="rounded-full p-1.5 hover:bg-ink/5"><X size={18} /></button>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["Satisfyer", "LELO", "Lovense", "Aneros", "Suction", "Prostate", "Couples"].map((s) => (
            <button key={s} type="button" onClick={() => router.push(`/shop?q=${s}`)} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-ink">{s}</button>
          ))}
        </div>
      </motion.form>
    </motion.div>
  );
}

export function CartDrawer() {
  const { cart, open, setOpen, setQty } = useStore();
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const left = Math.max(0, FREE_SHIP - sub);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog" aria-label="Your cart" data-lenis-prevent
            initial={{ x: "105%" }} animate={{ x: 0 }} exit={{ x: "105%" }} transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="fixed top-2 right-2 bottom-2 z-50 flex w-[calc(100%-1rem)] max-w-md flex-col overflow-hidden rounded-[2rem] bg-porcelain shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="display text-3xl">Your <em className="text-rose">bag</em></h2>
              <button onClick={() => setOpen(false)} aria-label="Close cart" className="rounded-full bg-ink/5 p-2.5 hover:bg-ink/10"><X size={18} /></button>
            </div>
            <div className="mx-6 rounded-2xl bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-semibold"><Truck size={16} className="text-rose" />
                {left > 0 ? <>Add <b>{inr(left)}</b> more for free delivery</> : <>You&apos;ve unlocked free discreet delivery 🎉</>}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-rose to-lilac" animate={{ width: `${Math.min(100, (sub / FREE_SHIP) * 100)}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>
            <ul className="mt-4 flex-1 space-y-3 overflow-y-auto px-6 pb-4">
              <AnimatePresence initial={false}>
                {cart.map((i) => (
                  <motion.li key={i.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80, height: 0, marginTop: 0 }}
                    className="flex gap-4 rounded-2xl bg-white p-3">
                    <Link href={`/product/${i.slug}`} onClick={() => setOpen(false)} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                      <Image src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <p className="line-clamp-2 text-sm leading-snug font-bold">{i.name}</p>
                      <p className="mt-0.5 text-sm text-muted">{inr(i.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-ink/10">
                          <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease" className="p-1.5"><Minus size={14} /></button>
                          <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                          <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase" className="p-1.5"><Plus size={14} /></button>
                        </div>
                        <span className="text-sm font-extrabold">{inr(i.price * i.qty)}</span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
              {cart.length === 0 && (
                <li className="py-16 text-center">
                  <div className="mx-auto grid size-20 animate-float place-items-center rounded-full bg-blush text-rose"><ShoppingBag size={30} /></div>
                  <p className="display mt-5 text-2xl">Your bag is feeling lonely</p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">Start exploring</Link>
                </li>
              )}
            </ul>
            {cart.length > 0 && (
              <div className="border-t border-ink/5 bg-white px-6 py-5">
                <div className="flex justify-between text-sm text-muted"><span>Subtotal</span><span className="text-lg font-extrabold text-ink">{inr(sub)}</span></div>
                <p className="mt-1 text-xs text-muted">Shipping & coupons applied at checkout · Plain unbranded box</p>
                <Link href="/checkout" onClick={() => setOpen(false)} className="mt-4 flex items-center justify-center gap-2 rounded-full bg-rose py-4 font-bold text-white shadow-[0_14px_30px_-12px_var(--color-rose)] transition hover:bg-rose-deep">
                  Checkout securely · {inr(sub)}
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function MobileTabBar() {
  const { cart, setOpen, ready } = useStore();
  const path = usePathname();
  const count = ready ? cart.reduce((s, i) => s + i.qty, 0) : 0;
  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop", icon: LayoutGrid },
    { href: "/wishlist", label: "Saved", icon: Heart },
    { href: "/account", label: "Me", icon: User },
  ];
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-full border border-white/10 bg-ink/90 px-2 py-2 text-white shadow-2xl backdrop-blur-xl sm:hidden" aria-label="Quick navigation">
      {tabs.map(({ href, label, icon: Icon }) => {
        const on = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link key={href} href={href} className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-[0.62rem] font-bold">
            {on && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <Icon size={19} className={on ? "text-lime" : "text-white/70"} />
            <span className={on ? "text-white" : "text-white/60"}>{label}</span>
          </Link>
        );
      })}
      <button onClick={() => setOpen(true)} className="relative grid size-12 place-items-center rounded-full bg-rose" aria-label="Open cart">
        <ShoppingBag size={19} />
        {count > 0 && <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-lime text-[0.65rem] font-extrabold text-ink">{count}</span>}
      </button>
    </nav>
  );
}

export function Toast() {
  const { toast } = useStore();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ y: 40, opacity: 0, x: "-50%" }} animate={{ y: 0, opacity: 1, x: "-50%" }} exit={{ y: 40, opacity: 0, x: "-50%" }}
          role="status" className="fixed bottom-24 left-1/2 z-[60] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-2xl sm:bottom-8">
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AgeGate() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read consent after mount
    try { setShow(localStorage.getItem("ib-18") !== "yes"); } catch { setShow(true); }
  }, []);
  const accept = () => { try { localStorage.setItem("ib-18", "yes"); } catch {} setShow(false); };
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-ink/70 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div role="dialog" aria-modal aria-labelledby="age-title" initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="grain relative w-full max-w-md overflow-hidden rounded-[2rem] bg-plum p-8 text-center text-white sm:p-10">
            <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-rose/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-lilac/30 blur-3xl" />
            <div className="relative">
              <div className="flex justify-center"><Logo light /></div>
              <p className="display mt-8 text-6xl text-lime">18+</p>
              <h2 id="age-title" className="display mt-3 text-3xl">Grown-ups only, please.</h2>
              <p className="mt-3 text-sm text-white/65">This store sells adult wellness products. By entering you confirm you are 18 years or older.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={accept} className="flex-1 rounded-full bg-lime py-3.5 font-extrabold text-ink transition hover:scale-[1.02]">I&apos;m 18 or older</button>
                <a href="https://www.google.com" className="flex-1 rounded-full border border-white/20 py-3.5 font-bold text-white/80 transition hover:bg-white/10">Leave</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

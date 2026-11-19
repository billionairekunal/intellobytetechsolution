import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 pt-24 text-center">
      <p className="display text-[9rem] leading-none text-rose">4<em className="text-lilac">0</em>4</p>
      <h1 className="display mt-4 text-4xl">This page got a little shy.</h1>
      <Link href="/shop" className="mt-8 inline-block rounded-full bg-ink px-7 py-4 font-bold text-white">Back to the shop</Link>
    </div>
  );
}

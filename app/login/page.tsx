import type { Metadata } from "next";
import Image from "next/image";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-10 sm:px-8 lg:grid-cols-2">
      <div className="grain relative hidden min-h-[36rem] overflow-hidden arch bg-plum lg:block">
        <Image src="/e/hero-5.webp" alt="" fill sizes="50vw" className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/20" />
        <p className="display absolute right-10 bottom-10 left-10 text-5xl text-white">Your pleasure, <em className="text-lime">your secret.</em></p>
      </div>
      <AuthForm next={safeNext} />
    </div>
  );
}

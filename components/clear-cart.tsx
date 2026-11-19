"use client";
import { useEffect } from "react";
import { useStore } from "./store";

export function ClearCart() {
  const { clear, ready } = useStore();
  useEffect(() => { if (ready) clear(); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

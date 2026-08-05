"use client";

import { useEffect, useRef } from "react";

export default function Seeder() {
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}

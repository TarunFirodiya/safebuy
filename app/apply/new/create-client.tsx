"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CreateClientProps {
  type: string;
  slug: string;
  journey: {
    role?: string;
    stage?: string;
    goal?: string;
    urgency?: string;
  };
}

/**
 * Creates the application via the API on mount, then replaces the URL with the
 * real /apply/[id] wizard. Kept as an explicit client step (rather than a
 * side-effecting GET) so link prefetching can never spawn stray applications.
 */
export function CreateApplication({ type, slug, journey }: CreateClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // guard against StrictMode double-invoke
    started.current = true;

    (async () => {
      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, slug, journey }),
        });
        const data = (await res.json().catch(() => null)) as
          | { id?: string; error?: string }
          | null;
        if (!res.ok || !data?.id) {
          throw new Error(data?.error ?? "Could not start your application.");
        }
        router.replace(`/apply/${data.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    })();
  }, [type, slug, journey, router]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-lg text-center">
        <h1 className="text-xl font-semibold text-foreground">
          We couldn&apos;t start your application
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{error}</p>
        <Link
          href="/start"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-dark)]"
        >
          Back to start
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center py-16 text-center">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]"
        aria-hidden="true"
      />
      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        Setting up your application…
      </p>
    </div>
  );
}

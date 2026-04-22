"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { LeadModal } from "@/components/lead-modal";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features",       href: "/#features" },
  { label: "How it works",   href: "/#how-it-works" },
  { label: "Services",       href: "/services" },
  { label: "Pricing",        href: "/#pricing" },
];

export function Nav() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [leadOpen, setLeadOpen]   = useState(false);

  return (
    <>
      <LeadModal open={leadOpen} onOpenChange={setLeadOpen} />

      <header className="fixed top-0 inset-x-0 z-40">
        <nav className="bg-white/80 backdrop-blur-xl border-b border-[var(--border)]">
          <div className="container-lg px-6 md:px-8">
            <div className="flex items-center justify-between h-16">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 shrink-0">
                <Image
                  src="/jumbo-safebuy-logo.png"
                  alt="Jumbo SafeBuy"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
                <span className="font-semibold text-base text-foreground tracking-tight">
                  Jumbo SafeBuy
                </span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center gap-7">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Desktop CTAs */}
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={() => setLeadOpen(true)}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Talk to an expert
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 -mr-2 text-[var(--text-secondary)]"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <Bars3Icon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
              <div className="lg:hidden border-t border-[var(--border)] py-4">
                <ul className="space-y-1 mb-4">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setLeadOpen(true);
                    }}
                    className="w-full py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                  >
                    Talk to an expert
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

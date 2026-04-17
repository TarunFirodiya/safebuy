import type { Variants } from "framer-motion";

// Stripe-aligned easing — confident, not bouncy
const EASE = [0.25, 0.1, 0.25, 1.0] as const;
const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;

export const transitions = {
  fadeInUp:    { duration: 0.55, ease: EASE_OUT },
  staggerItem: { duration: 0.5,  ease: EASE_OUT },
  scaleIn:     { duration: 0.45, ease: EASE },
  smooth:      { duration: 0.3,  ease: EASE },
} as const;

export const VIEWPORT = { once: true, margin: "-80px" } as const;

export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

"use client";

import { motion } from "framer-motion";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { BookCalendlyButton } from "@/components/book-calendly-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fadeInUp, transitions, VIEWPORT } from "@/lib/motion";

const faqs = [
  {
    question: "What is Jumbo SafeBuy and how can it help me?",
    answer: [
      "Jumbo SafeBuy is your end-to-end partner for buying or selling a resale flat in Bangalore. Think of us as the one team that handles everything — legal checks, document drafting, bank coordination, registration, and the post-sale paperwork nobody tells you about.",
      "Most buyers and sellers end up juggling lawyers, brokers, banks, and multiple offices on their own. We take that off your plate. You get one dedicated lawyer and one relationship manager who manages the entire journey, keeping you updated from start to finish — without you having to run around or chase people.",
      "We handle everything from legal verification and loan coordination to registration support and post-registration work like Khata, BESCOM, and tax transfers. The whole thing. From the comfort of your home.",
    ],
  },
  {
    question: "What type of properties does Jumbo SafeBuy handle?",
    answer: [
      "We work only with residential resale and under-construction flats in Bangalore — no land, no commercial property.",
      "This focused approach means we've gotten genuinely good at one thing. Every resale apartment transaction we handle makes us better at the next one.",
    ],
  },
  {
    question: "At what stage should I contact Jumbo SafeBuy?",
    answer: [
      "For buyers: ideally before you pay any token. That's when the most risk exists and the most can go wrong. But if you've already paid token, are mid-loan, or are even a week away from registration — reach out. We step in at any stage.",
      "For sellers: the earlier the better. If your Khata is outdated, your EC is missing, your tax records have errors, or your documents need corrections — it's much easier to fix these before you have a buyer waiting. Early preparation means faster closings and less stress when it matters.",
      "We're built to jump in wherever your transaction stands and do exactly what's needed from that point.",
    ],
  },
  {
    question: "I'm buying a resale flat. What problem does Jumbo SafeBuy solve for me?",
    answer: [
      "Buying a resale flat means a lot more than agreeing on a price. There's ownership history to verify, documents to check for hidden risks, token money to protect, bank paperwork to coordinate, agreements to draft, registration to manage, and post-sale transfers that nobody explains to you.",
      "Most people don't realise how many things can go wrong until something already has.",
      "We manage the entire journey: title search, document scrutiny, sale agreement drafting, loan assistance, stamp duty support, registration at the sub-registrar office, and post-registration transfers for Khata, BESCOM, and tax records.",
      "Instead of coordinating separately with a lawyer, broker, bank, and multiple offices — one team handles everything. You stay updated, you don't run around, and the whole experience is far less stressful.",
    ],
  },
  {
    question: "I'm selling my flat. Why would I need Jumbo SafeBuy?",
    answer: [
      "Finding a buyer is only half the battle. The other half is being ready when a serious buyer is standing there.",
      "Serious buyers ask for documents — your Sale Deed, Khata, Encumbrance Certificate, tax receipts, loan closure papers. If anything is missing, outdated, or inconsistent, deals slow down, trust drops, and sometimes they fall apart entirely.",
      "We help you get transaction-ready before you need to be. We handle EC, Khata updates, tax corrections, certified copies, loan closure support, deed corrections, POA, family transfer deeds, TDS assistance, and sale documentation.",
      "Prepare once, move fast when the right buyer shows up.",
    ],
  },
  {
    question:
      "I already have a lawyer / broker / bank loan. Why would I still need Jumbo SafeBuy?",
    answer: [
      "Your lawyer reviews papers. Your broker finds you a buyer. Your bank processes the loan. But none of them own the whole journey.",
      "There's a gap in between — the follow-ups, the coordination, the post-registration steps, the accountability when something slips. That's where things break down and deals get delayed.",
      "Jumbo SafeBuy fills that gap. One team that manages the entire process end-to-end, keeps all parties coordinated, and makes sure nothing falls through the cracks after registration.",
    ],
  },
  {
    question: "Can I just do all this myself and save money?",
    answer: [
      "You can. Most people who do realise it costs them more than money — it costs time, energy, and peace of mind. Repeated office visits, chasing people who don't call back, documents that get drafted wrong, post-registration steps that get missed.",
      "We exist for people who value their time and want the job done right the first time, without having to manage every detail themselves.",
    ],
  },
  {
    question: "Why do customers trust Jumbo SafeBuy?",
    answer: [
      "Because we combine legal expertise, hands-on execution, and end-to-end convenience — all with one team that actually manages the process, not just reviews it.",
      "Most service providers look at one piece of your transaction. We manage the whole story — from first conversation to the flat actually being in your name and all the paperwork updated.",
      "500+ customers served and growing. The reason people come back and refer us is simple: we remove the stress from what is otherwise a complicated, high-stakes process.",
    ],
  },
  {
    question:
      "Why should I pay for legal due diligence when the bank is already giving me a loan?",
    answer: [
      "Bank legal checks protect the bank's interest — whether the property is good security for the loan. That's their job.",
      "Your interests as a buyer are different. A title search report checks ownership history, past transactions, encumbrances, whether the seller actually has the right to sell, and whether there are hidden liabilities or disputes — risks that won't show up in a basic document review.",
      "In resale transactions especially, independent buyer-side due diligence is worth it. It gives you clarity before you pay token, before you sign anything, before you're committed. If something is wrong, you'd rather know now than after you've paid.",
    ],
  },
  {
    question: "What is a Jumbo SafeBuy Escrow?",
    answer: [
      "A way to protect your token money during a resale transaction.",
      "Instead of handing your token directly to the seller, it goes into a neutral escrow account. The money is released only after agreed conditions are met — like satisfactory legal due diligence or signing a term sheet.",
      "If we find title defects, ownership disputes, unpaid dues, or any material concern — the token isn't released. It's refunded to you.",
      "Both parties benefit: the buyer knows their money is safe, and the seller gets proof of serious intent. It makes the whole transaction more transparent and less stressful for everyone involved.",
    ],
  },
] as const;

export function FaqSection() {
  return (
    <section className="section-wrapper">
      <div className="container-lg px-6 md:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">

          {/* Left */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={transitions.fadeInUp}
          >
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Questions buyers ask us
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
              The same questions come up before every transfer. Here's exactly
              how we handle them.
            </p>
            <BookCalendlyButton className="mt-8 inline-flex items-center gap-2 h-10 px-5 rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-foreground hover:border-[var(--border-strong)] hover:bg-white transition-colors">
              <PhoneIcon className="w-4 h-4 text-[var(--text-muted)]" />
              Still unsure? Book a call
            </BookCalendlyButton>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            className="lg:col-span-3"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={{ ...transitions.fadeInUp, delay: 0.1 }}
          >
            <Accordion multiple={false} className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={i}
                  className="border-[var(--border)]"
                >
                  <AccordionTrigger className="text-left text-sm font-medium text-foreground py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[var(--text-secondary)] leading-relaxed pb-5">
                    <div className="space-y-3">
                      {faq.answer.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

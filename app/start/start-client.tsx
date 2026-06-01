"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  HomeModernIcon,
  KeyIcon,
  BanknotesIcon,
  QuestionMarkCircleIcon,
  BoltIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Stepper } from "@/components/onboarding/stepper";
import { QuizOption } from "@/components/onboarding/quiz-option";
import { EligibilityCard } from "@/components/onboarding/eligibility-card";
import { transitions } from "@/lib/motion";
import {
  getRecommendations,
  goalsByStage,
  journeyStages,
  roleOptions,
  stageLabels,
  type JourneyStage,
  type QuizAnswers,
  type RecommendationItem,
  type Urgency,
  type UserRole,
} from "@/lib/recommendations";

const roleIcons: Record<UserRole, typeof HomeModernIcon> = {
  buyer: HomeModernIcon,
  owner: KeyIcon,
  seller: BanknotesIcon,
  other: QuestionMarkCircleIcon,
};

type Phase = "role" | "stage" | "goal" | "urgency" | "results";
const QUIZ_PHASES: Phase[] = ["role", "stage", "goal", "urgency"];

interface Draft {
  role?: UserRole;
  stage?: JourneyStage;
  goal?: string;
  urgency?: Urgency;
}

export function StartQuiz() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("role");
  const [draft, setDraft] = useState<Draft>({});
  const [starting, setStarting] = useState(false);

  const stepIndex = QUIZ_PHASES.indexOf(phase as (typeof QUIZ_PHASES)[number]);
  const isResults = phase === "results";

  const recommendations = useMemo(() => {
    if (!isResults || !draft.role || !draft.stage || !draft.goal || !draft.urgency) {
      return null;
    }
    const answers: QuizAnswers = {
      role: draft.role,
      stage: draft.stage,
      goal: draft.goal,
      urgency: draft.urgency,
    };
    return getRecommendations(answers);
  }, [isResults, draft]);

  function goBack() {
    if (phase === "results") return setPhase("urgency");
    const idx = QUIZ_PHASES.indexOf(phase as (typeof QUIZ_PHASES)[number]);
    if (idx > 0) setPhase(QUIZ_PHASES[idx - 1]);
  }

  function pickRole(role: UserRole) {
    // Default the stage to a sensible starting point per role; the user can
    // still change it on the next screen.
    const defaultStage: JourneyStage =
      role === "owner"
        ? "for-owners"
        : role === "seller"
          ? "for-buying"
          : "before-buying";
    setDraft((d) => ({ ...d, role, stage: defaultStage }));
    setPhase("stage");
  }

  function pickStage(stage: JourneyStage) {
    setDraft((d) => ({ ...d, stage, goal: undefined }));
    setPhase("goal");
  }

  function pickGoal(goal: string) {
    setDraft((d) => ({ ...d, goal }));
    setPhase("urgency");
  }

  function pickUrgency(urgency: Urgency) {
    setDraft((d) => ({ ...d, urgency }));
    setPhase("results");
  }

  function startApplication(item: RecommendationItem) {
    if (!draft.role || !draft.stage || !draft.goal || !draft.urgency) return;
    setStarting(true);
    const params = new URLSearchParams({
      type: item.type,
      slug: item.slug,
      role: draft.role,
      stage: draft.stage,
      goal: draft.goal,
      urgency: draft.urgency,
    });
    router.push(`/apply/new?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Header: progress + back */}
      <div className="mb-8">
        {!isResults ? (
          <Stepper current={stepIndex + 1} total={QUIZ_PHASES.length} />
        ) : (
          <Stepper current={QUIZ_PHASES.length} total={QUIZ_PHASES.length} label="Your matches" />
        )}
        {phase !== "role" && (
          <button
            type="button"
            onClick={goBack}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transitions.smooth}
        >
          {phase === "role" && (
            <QuizStep
              title="What brings you to SafeBuy?"
              subtitle="We'll tailor the next steps to your situation."
            >
              {roleOptions.map((opt) => (
                <QuizOption
                  key={opt.id}
                  label={opt.label}
                  helper={opt.helper}
                  Icon={roleIcons[opt.id]}
                  selected={draft.role === opt.id}
                  onSelect={() => pickRole(opt.id)}
                />
              ))}
            </QuizStep>
          )}

          {phase === "stage" && (
            <QuizStep
              title="Where are you in the journey?"
              subtitle="This helps us narrow down the right paperwork."
            >
              {journeyStages.map((stage) => (
                <QuizOption
                  key={stage}
                  label={stageLabels[stage].label}
                  helper={stageLabels[stage].helper}
                  selected={draft.stage === stage}
                  onSelect={() => pickStage(stage)}
                />
              ))}
            </QuizStep>
          )}

          {phase === "goal" && draft.stage && (
            <QuizStep
              title="What do you want to get done?"
              subtitle="Pick the closest match — you can change this later."
            >
              {goalsByStage[draft.stage].map((goal) => (
                <QuizOption
                  key={goal.id}
                  label={goal.label}
                  helper={goal.helper}
                  selected={draft.goal === goal.id}
                  onSelect={() => pickGoal(goal.id)}
                />
              ))}
            </QuizStep>
          )}

          {phase === "urgency" && (
            <QuizStep
              title="How soon do you need this?"
              subtitle="We'll prioritise faster options if you're in a hurry."
            >
              <QuizOption
                label="Standard timeline"
                helper="Best value — our normal delivery time"
                Icon={CalendarDaysIcon}
                selected={draft.urgency === "standard"}
                onSelect={() => pickUrgency("standard")}
              />
              <QuizOption
                label="I need it fast"
                helper="Surface express options where available"
                Icon={BoltIcon}
                selected={draft.urgency === "fast"}
                onSelect={() => pickUrgency("fast")}
              />
            </QuizStep>
          )}

          {phase === "results" && recommendations && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Here&apos;s what we recommend
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Based on your answers. Fixed price, clear timeline — start now and
                add your details near the end.
              </p>

              <div className="mt-6 space-y-3">
                <EligibilityCard
                  item={recommendations.primary}
                  primary
                  onStart={startApplication}
                  starting={starting}
                />
                {recommendations.alternates.map((item) => (
                  <EligibilityCard
                    key={`${item.type}:${item.slug}`}
                    item={item}
                    onStart={startApplication}
                    starting={starting}
                  />
                ))}
              </div>

              <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
                Not quite right?{" "}
                <Link
                  href="/services"
                  className="font-medium text-[var(--primary)] hover:underline"
                >
                  Browse all services
                </Link>{" "}
                or{" "}
                <button
                  type="button"
                  onClick={() => setPhase("role")}
                  className="font-medium text-[var(--primary)] hover:underline"
                >
                  retake the quiz
                </button>
                .
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuizStep({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{subtitle}</p>
      <div className="mt-6 space-y-3">{children}</div>
    </div>
  );
}

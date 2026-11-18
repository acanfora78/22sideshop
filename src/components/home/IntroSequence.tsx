"use client";

import { ArrivalIntro } from "./ArrivalIntro";
import { IntroDoor } from "./IntroDoor";
import { MovementIntro } from "./MovementIntro";
import { INTRO_VARIANT } from "./intro-config";

/** Homepage opening. Switch variant in intro-config.ts. */
export function IntroSequence() {
  if (INTRO_VARIANT === "door") return <IntroDoor />;
  if (INTRO_VARIANT === "arrival") return <ArrivalIntro />;
  return <MovementIntro />;
}

"use client";

import { ArrivalIntro } from "./ArrivalIntro";
import { IntroDoor } from "./IntroDoor";
import { INTRO_VARIANT } from "./intro-config";

/** Homepage opening. Switch variant in intro-config.ts. */
export function IntroSequence() {
  return INTRO_VARIANT === "door" ? <IntroDoor /> : <ArrivalIntro />;
}

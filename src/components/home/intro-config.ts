/** Intro is shown at most once per 12h per browser. */
export const INTRO_STORAGE_KEY = "22side.intro.seen";
export const INTRO_TTL_MS = 12 * 60 * 60 * 1000;

/**
 * Which opening plays on the homepage.
 *  - "arrival": THE ARRIVAL — subway platform, train, 22 SIDE STREET sign (current).
 *  - "door":    the kid unlocking the shop door (kept on request, see archive/intro-porta-chiave).
 */
export const INTRO_VARIANT: "arrival" | "door" = "arrival";

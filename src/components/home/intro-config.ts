/** Intro is shown once per browsing session (sessionStorage); the TTL is a safety cap. */
export const INTRO_STORAGE_KEY = "22side.intro.seen";
export const INTRO_TTL_MS = 12 * 60 * 60 * 1000;

/**
 * Which opening plays on the homepage.
 *  - "movement": THE MOVEMENT — cinematic short: the rapper, the key, the door, the store (video kept).
 *  - "arrival": THE ARRIVAL — subway platform, train, 22 SIDE STREET sign.
 *  - "door":    the kid unlocking the shop door (current, chosen by the brand).
 */
export const INTRO_VARIANT: "movement" | "arrival" | "door" = "door";

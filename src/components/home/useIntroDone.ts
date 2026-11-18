"use client";

import { useSyncExternalStore } from "react";

export const INTRO_DONE_EVENT = "22side:intro-done";

let doneEarly = false;

/** Signals the hero to start before the intro overlay is fully gone (e.g. while doors open). */
export function markIntroDone() {
  doneEarly = true;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(INTRO_DONE_EVENT, cb);
  return () => window.removeEventListener(INTRO_DONE_EVENT, cb);
};
const getSnapshot = () => doneEarly || document.documentElement.getAttribute("data-intro") === "seen";
const getServerSnapshot = () => false;

/** True once the intro is dismissed (or was never shown). Hero entrance waits on this. */
export function useIntroDone(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

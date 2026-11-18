"use client";

import { useSyncExternalStore } from "react";

export const INTRO_DONE_EVENT = "22side:intro-done";

const subscribe = (cb: () => void) => {
  window.addEventListener(INTRO_DONE_EVENT, cb);
  return () => window.removeEventListener(INTRO_DONE_EVENT, cb);
};
const getSnapshot = () => document.documentElement.getAttribute("data-intro") === "seen";
const getServerSnapshot = () => false;

/** True once the intro is dismissed (or was never shown). Hero entrance waits on this. */
export function useIntroDone(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

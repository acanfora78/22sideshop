"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

/** Demo newsletter: validates locally, sends nothing. Wire to Shopify customer marketing later. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  return (
    <form
      className="mt-8 max-w-md"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "done" : "error");
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex border-b border-dirty/40 focus-within:border-dirty">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          placeholder="your@email.com"
          className="w-full bg-transparent py-3 font-mono text-sm text-dirty placeholder:text-concrete focus:outline-none"
          aria-invalid={state === "error"}
          aria-describedby="newsletter-msg"
        />
        <button type="submit" className="label flex items-center gap-2 px-2 text-dirty hover:text-blood-bright" aria-label="Subscribe">
          Join <ArrowRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      <p id="newsletter-msg" role="status" className="label mt-3 min-h-4 text-[0.6rem] text-concrete">
        {state === "error" && <span className="text-blood-bright">Enter a valid email address.</span>}
        {state === "done" && <span className="text-dirty">You&apos;re on the list — demo only, nothing was sent.</span>}
        {state === "idle" && "Demo form — no data is stored or sent."}
      </p>
    </form>
  );
}

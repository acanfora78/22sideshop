/**
 * THE MOVEMENT — copy and media for the opening film, hero and store intro.
 * EN = identity (titles, slogans, slate); IT = experience (captions, descriptions, controls).
 *
 * All film stills are ORIGINAL AI-generated images (ElevenLabs · gemini-3-pro-image)
 * of a FICTIONAL character, graded to the brand palette by scripts/assets/grade.py.
 * Provenance: public/media/movement/README.md
 */
const m = (f: string) => `/media/movement/${f}`;

export const movement = {
  intro: {
    lineOne: "This is not just streetwear.",
    lineTwo: "This is a movement.",
    cta: "Enter the movement",
    skip: "Salta l’intro",
    soundOn: "Audio on",
    soundOff: "Audio off",
  },
  shots: [
    { id: "city", src: m("film-01-city.webp"), video: m("clip-01-city"), label: "The City", caption: "New York, 2:22 di notte. La città dorme, il blocco no.", focus: "50% 55%" },
    { id: "arrival", src: m("film-02-arrival.webp"), video: m("clip-02-arrival"), label: "The Arrival", caption: "Arriva davanti al negozio. L’insegna è ancora spenta a metà.", focus: "36% 50%" },
    { id: "key", src: m("film-03-key.webp"), video: m("clip-03-key"), label: "The Key", caption: "Una chiave sola, con il 22 sul portachiavi.", focus: "55% 45%" },
    { id: "lock", src: m("film-04-lock.webp"), video: m("clip-04-lock"), label: "The Key", caption: "La serratura gira. Click.", focus: "55% 50%" },
    { id: "door", src: m("film-05-door.webp"), video: m("clip-05-door"), label: "Open the Door", caption: "La porta si apre sul buio.", focus: "52% 55%" },
    { id: "store", src: m("film-06-store.webp"), video: m("clip-06-store"), label: "The Store", caption: "Le luci si accendono una dopo l’altra.", focus: "50% 50%" },
    { id: "movement", src: m("film-07-movement.webp"), video: m("clip-07-movement"), label: "The Movement", caption: "22.", focus: "50% 40%" },
  ],
  hero: {
    image: m("still-movement-alt.webp"),
    imageAlt: "Un ragazzo con giacca di pelle nera in piedi al centro del negozio 22SIDE, davanti a un enorme 22 dipinto sul muro.",
    kicker: "22SIDE — The Movement",
    title: "The movement.",
    sub: "22SIDE non è solo streetwear. È un modo di stare al mondo: indipendente, nato a Scafati e cresciuto con la cultura underground di New York, tenuto insieme da un numero.",
    primaryCta: { label: "Acquista ora", href: "/shop" },
    secondaryCta: { label: "Entra nel negozio", href: "#store" },
  },
  store: {
    index: "03",
    label: "The Store",
    title: "The Store",
    intro:
      "Tutti i capi 22SIDE, fotografati per strada. Passa sopra un capo per vederlo da un'altra angolazione, aprilo per tutti i dettagli.",
    overview: m("store-overview.webp"),
    overviewAlt: "Interno vuoto del negozio con due barre appendiabiti e un grande 22 dipinto sulla parete.",
    note: "Taglie in arrivo.",
  },
  why22: {
    label: "Why 22",
    title: "Two sides. One number.",
    body: "Il 22 sono due tratti uguali, uno accanto all’altro: i due binari della Line 22, le due anime della strada, tu e la tua crew. È il segno che riconosci anche senza logo. Ovunque lo vedi, sei dalla parte giusta.",
  },
};

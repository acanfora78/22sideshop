# public/media/movement — provenance

| File | Source |
|---|---|
| `film-01…07-*.webp`, `still-*.webp`, `store-overview.webp` | Original AI-generated stills (ElevenLabs Flows · `gemini-3-pro-image`), Nov 2026. The character is **fictional** and not based on any real person or artist. |
| `clip-01…07-*.mp4` (+ `-m.mp4` mobile) | Original AI-generated video (ElevenLabs Flows · `kling-3-pro`, image-to-video from the stills above), Nov 2026. 7 clips × 5,090 credits. Trimmed, de-pillarboxed, graded and compressed with `scripts/assets/cut_clip.sh`; audio removed. |
| `wall-*.webp` | Original AI-generated empty store walls (same tool). Garments are composited in code from the demo placeholders. |

All images were graded to the 22SIDE palette with `scripts/assets/grade.py` (desaturated, reds kept, black bars trimmed).
Garments visible in the film are generic and unbranded; they do not represent real 22SIDE products.
Replace with real campaign photography when available — paths are referenced from `src/content/movement.ts` and `src/content/store.ts`.

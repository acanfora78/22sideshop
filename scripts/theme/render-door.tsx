// Renders the React intro scene to static SVG for the Liquid theme (snippets/door-scene.liquid).
import { renderToStaticMarkup } from "react-dom/server";
import { DoorScene } from "../../src/components/home/DoorScene";
process.stdout.write(renderToStaticMarkup(<DoorScene onComplete={() => {}} />));

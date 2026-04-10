import { registerRoot, Composition } from "remotion";
import { AiTutorial } from "./src/AiTutorial";

registerRoot(AiTutorial);

Composition({
  id: "AiTutorial",
  component: AiTutorial,
  durationInFrames: 300,
  fps: 30,
  width: 1080,
  height: 1920,
});

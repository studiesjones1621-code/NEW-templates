import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// OnDuty brand (from ondutyagent.com): deep blue-black, electric lime accent, Host Grotesk + Geist Mono.
// Fonts are bundled in public/fonts (SIL Open Font License) so rendering never depends on the network.
export const sans = "Host Grotesk";
export const mono = "Geist Mono";
loadFont({ family: sans, url: staticFile("fonts/HostGrotesk.woff2"), weight: "300 800" });
loadFont({ family: mono, url: staticFile("fonts/GeistMono-500.woff2"), weight: "500" });

export const C = {
  bg: "#0d1014",
  panel: "#161b21",
  line: "rgba(255,255,255,0.12)",
  ink: "#f4f6f2",
  dim: "rgba(244,246,242,0.62)",
  lime: "#c8f04a",
  red: "#ff4d5e",
};

export const FPS = 30;

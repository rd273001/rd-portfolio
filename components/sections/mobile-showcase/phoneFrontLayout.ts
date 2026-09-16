/**
 * Front-face layout for the 2D loading frame. Keep in sync with
 * `scripts/build-android-phone-glb.mjs` finish + front insets and frame bbox
 * (~2.45 × 4.81).
 *
 * Rim / radius lengths use `cqw` from a `container-type: size` wrapper so every
 * inset is the same physical width. Padding % would be the parent panel, and
 * `% / %` radii would not stay concentric with that inset.
 */
const frameW = 2.45;
const frameH = 4.81;
const bodyWidth = 2.34;
const bodyRadius = 0.31;
const frontFrameRim = 0.012;
const displayBezel = 0.054;

const frameR = bodyRadius + Math.max(0, (frameW - bodyWidth) / 2);
const glassW = frameW - frontFrameRim * 2;
const glassH = frameH - frontFrameRim * 2;
const glassR = frameR - frontFrameRim;
const screenW = glassW - displayBezel * 2;
const screenH = glassH - displayBezel * 2;
const screenR = glassR - displayBezel;

const punchOffsetFromScreenTop = 0.1;
const punchOuterRadius = 0.032;

/** Keep in sync with MobileShowcaseScene camera + phone scale. */
const meshScale = 0.78;
const cameraFovDeg = 26;
const cameraZ = 10.2;
const visibleHeight =
  2 * Math.tan((cameraFovDeg * Math.PI) / 360) * cameraZ;
const viewportHeightPct = ((frameH * meshScale) / visibleHeight) * 100;

const cqw = (value: number) => `${((value / frameW) * 100).toFixed(4)}cqw`;
const pctOfWidth = (value: number, width: number) =>
  `${(value / width) * 100}%`;

export const phoneFrontLayout = {
  aspectRatio: `${frameW} / ${frameH}`,
  viewportHeight: `${viewportHeightPct.toFixed(2)}%`,
  colors: {
    /** `finish.frame` in build-android-phone-glb.mjs — lit metal, not a flat grey band */
    frame: "#4a4d52",
    frameHighlight: "#7a7e85",
    frameMid: "#3a3d42",
    frameShadow: "#16181b",
    /** `finish.glassBezel` */
    glassBezel: "#030303",
    /** `finish.display` */
    display: "#050505",
    punchHole: "#020202",
    punchLens: "#050b14",
  },
  frame: {
    padding: cqw(frontFrameRim),
    borderRadius: cqw(frameR),
    background: "linear-gradient(180deg, #6e7278 0%, #5c6066 100%)",
    boxShadow: "0 28px 70px -36px rgba(0,0,0,0.85)",
  },
  glass: {
    padding: cqw(displayBezel),
    borderRadius: cqw(glassR),
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.85)",
  },
  screen: {
    borderRadius: cqw(screenR),
  },
  punchHole: {
    centerTop: `${(punchOffsetFromScreenTop / screenH) * 100}%`,
    size: pctOfWidth(punchOuterRadius * 2, screenW),
    lensSize: pctOfWidth(0.013 * 2, screenW),
  },
};

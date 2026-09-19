import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BoxGeometry,
  CircleGeometry,
  Color,
  CurvePath,
  CylinderGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  LineCurve3,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  QuadraticBezierCurve3,
  Scene,
  Shape,
  ShapeGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

class FileReaderPolyfill {
  result = null;
  onload = null;
  onloadend = null;
  onerror = null;

  readAsArrayBuffer(blob) {
    blob
      .arrayBuffer()
      .then((buffer) => {
        this.result = buffer;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      })
      .catch((error) => {
        this.onerror?.(error);
      });
  }
}

globalThis.FileReader = FileReaderPolyfill;

// --- TRUE OBSIDIAN STEADY FINISH COLOR PALETTE ---
const finish = {
  frame: 0x4a4d52,
  backGlass: 0x2b2b2b,
  glassBezel: 0x030303,
  display: 0x050505,
  cameraLensWindow: 0x08080a,
  lensRing: 0x1e1f22,
  lensWell: 0x020203,
  lensGlass: 0x040810,
  lensCore: 0x010203,
  flash: 0xfdfbf7,
  portCavity: 0x000000,
  usbGold: 0xc6a36a,
  antennaSide: 0x2e2f32,
  antennaBottom: 0x121214,
  button: 0x1c1c1e,
};

function insetRounded(width, height, radius, inset) {
  const pad = Math.max(0, inset);
  return {
    width: Math.max(0.02, width - pad * 2),
    height: Math.max(0.02, height - pad * 2),
    radius: Math.max(0.001, radius - pad),
  };
}

function roundedRectShape(width, height, radius, clockwise = false) {
  const shape = new Shape();
  const hw = width / 2;
  const hh = height / 2;
  const r = Math.min(radius, hw, hh);

  if (clockwise) {
    shape.moveTo(-hw + r, -hh);
    shape.absarc(-hw + r, -hh + r, r, -Math.PI / 2, Math.PI, true);
    shape.lineTo(-hw, hh - r);
    shape.absarc(-hw + r, hh - r, r, Math.PI, Math.PI / 2, true);
    shape.lineTo(hw - r, hh);
    shape.absarc(hw - r, hh - r, r, Math.PI / 2, 0, true);
    shape.lineTo(hw, -hh + r);
    shape.absarc(hw - r, -hh + r, r, 0, -Math.PI / 2, true);
    return shape;
  }

  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.absarc(hw - r, -hh + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(hw, hh - r);
  shape.absarc(hw - r, hh - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-hw + r, hh);
  shape.absarc(-hw + r, hh - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-hw, -hh + r);
  shape.absarc(-hw + r, -hh + r, r, Math.PI, Math.PI * 1.5, false);

  return shape;
}

function extrude(width, height, radius, depth, bevel) {
  const geometry = new ExtrudeGeometry(roundedRectShape(width, height, radius), {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: bevel > 0 ? 12 : 1,
    curveSegments: 64,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function roundedScreen(width, height, radius) {
  const geometry = new ShapeGeometry(roundedRectShape(width, height, radius), 64);
  const pos = geometry.attributes.position;
  const uvs = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i += 1) {
    uvs[i * 2] = pos.getX(i) / width + 0.5;
    uvs[i * 2 + 1] = pos.getY(i) / height + 0.5;
  }

  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}

function roundedRing(outer, inner) {
  const shape = roundedRectShape(outer.width, outer.height, outer.radius);
  shape.holes.push(roundedRectShape(inner.width, inner.height, inner.radius, true));
  const geometry = new ShapeGeometry(shape, 64);
  geometry.computeVertexNormals();
  return geometry;
}

function getFrameMetal() {
  return new MeshPhysicalMaterial({
    color: new Color(finish.frame),
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 1.15,
    clearcoat: 0.28,
    clearcoatRoughness: 0.24,
  });
}

function getBackSatin() {
  return new MeshPhysicalMaterial({
    color: new Color(0x1e1e1e),
    metalness: 0.07,
    roughness: 0.62,
    envMapIntensity: 0.2,
    clearcoat: 0.16,
    clearcoatRoughness: 0.68,
    vertexColors: true,
  });
}

function tintBackGlass(geometry) {
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < pos.count; i += 1) {
    const y = pos.getY(i);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const range = maxY - minY || 1;
  for (let i = 0; i < pos.count; i += 1) {
    const t = (pos.getY(i) - minY) / range;
    const k = 0.9 + t * 0.16;
    colors[i * 3] = k;
    colors[i * 3 + 1] = k;
    colors[i * 3 + 2] = k;
  }

  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
}

function getPolishedMetal(color) {
  return new MeshStandardMaterial({
    color: new Color(color),
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 0.9,
  });
}

function getButtonMetal() {
  return new MeshPhysicalMaterial({
    color: new Color(0x2a2b2e),
    metalness: 1,
    roughness: 0.08,
    envMapIntensity: 1.2,
    clearcoat: 0.55,
    clearcoatRoughness: 0.12,
  });
}

function getMatteGlass(color) {
  return new MeshStandardMaterial({
    color: new Color(color),
    metalness: 0,
    roughness: 0.85,
    envMapIntensity: 0.12,
  });
}

function getSoftGlass(color) {
  return new MeshPhysicalMaterial({
    color: new Color(color),
    metalness: 0.08,
    roughness: 0.32,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.35,
  });
}

function getGlossyGlass(color) {
  return new MeshStandardMaterial({
    color: new Color(color),
    metalness: 0.04,
    roughness: 0.4,
    envMapIntensity: 0.12,
  });
}

function getShadowVoid(color) {
  return new MeshStandardMaterial({
    color: new Color(color),
    metalness: 0,
    roughness: 1,
  });
}

function insetStadium(width, height, depth) {
  const geometry = new ExtrudeGeometry(
    roundedRectShape(width, height, height * 0.49),
    { depth, bevelEnabled: false, curveSegments: 20 },
  );
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function addTopCavity(parent, x, faceY, width, height, depth, name, material = getShadowVoid(0x0b0c0e)) {
  const rim = insetStadium(width + 0.016, height + 0.014, 0.008);
  rim.rotateX(Math.PI);
  add(
    parent,
    rim,
    getPolishedMetal(0x2c2e32),
    `${name}Rim`,
    [x, faceY + 0.001, 0],
  );

  const hole = insetStadium(width, height, depth);
  hole.rotateX(Math.PI);
  return add(
    parent,
    hole,
    material,
    name,
    [x, faceY + 0.004, 0],
  );
}

function addBottomCavity(parent, x, faceY, width, height, depth, name, material = getShadowVoid(0x0b0c0e)) {
  add(
    parent,
    insetStadium(width + 0.016, height + 0.014, 0.008),
    getPolishedMetal(0x2c2e32),
    `${name}Rim`,
    [x, faceY - 0.001, 0],
  );

  return add(
    parent,
    insetStadium(width, height, depth),
    material,
    name,
    [x, faceY - 0.004, 0],
  );
}

function addSpeakerGrill(parent, x, faceY, width, height, name) {
  add(
    parent,
    insetStadium(width * 0.82, height * 0.52, 0.006),
    new MeshStandardMaterial({
      color: new Color(0x1c1d20),
      metalness: 0.35,
      roughness: 0.55,
      envMapIntensity: 0.25,
    }),
    `${name}Grill`,
    [x, faceY + 0.004, 0],
  );

  const slits = 7;
  const span = width * 0.52;
  for (let i = 0; i < slits; i += 1) {
    const t = i / (slits - 1) - 0.5;
    add(
      parent,
      new BoxGeometry(width * 0.055, 0.005, height * 0.3),
      getShadowVoid(0x050506),
      `${name}Slit${i}`,
      [x + t * span, faceY + 0.007, 0],
    );
  }
}

function antennaMaterial(color) {
  return new MeshStandardMaterial({
    color: new Color(color),
    metalness: 0.18,
    roughness: 0.52,
    envMapIntensity: 0.12,
  });
}

function addRailAntenna(parent, { kind, x, y, frontZ, backZ, bevel, name, color }) {
  const mat = antennaMaterial(color);
  const d = 0.005;
  const wrapFront = 0.03;
  const wrapBack = 0.004;
  const tubeR = 0.003;
  const bandScale = 7.2;
  const path = new CurvePath();

  if (kind === "side") {
    const side = x > 0 ? 1 : -1;
    const xS = x - side * d;
    const zF = frontZ - d;
    const zB = backZ + d;
    const frontInner = new Vector3(x - side * (bevel + wrapFront), 0, zF);
    const frontCorner = new Vector3(x - side * bevel, 0, zF);
    const sideFront = new Vector3(xS, 0, frontZ - bevel);
    const sideBack = new Vector3(xS, 0, backZ + bevel);
    const backCorner = new Vector3(x - side * bevel, 0, zB);
    const backInner = new Vector3(x - side * (bevel + wrapBack), 0, zB);
    path.add(new LineCurve3(frontInner, frontCorner));
    path.add(new QuadraticBezierCurve3(frontCorner, new Vector3(xS, 0, zF), sideFront));
    path.add(new LineCurve3(sideFront, sideBack));
    path.add(new QuadraticBezierCurve3(sideBack, new Vector3(xS, 0, zB), backCorner));
    path.add(new LineCurve3(backCorner, backInner));
    const mesh = add(parent, new TubeGeometry(path, 56, tubeR, 8, false), mat, name, [0, y, 0]);
    mesh.scale.y = bandScale;
    return;
  }

  const inward = y > 0 ? -1 : 1;
  const yE = y + inward * d;
  const zF = frontZ - d;
  const zB = backZ + d;
  const frontInner = new Vector3(0, y + inward * (bevel + wrapFront), zF);
  const frontCorner = new Vector3(0, y + inward * bevel, zF);
  const endFront = new Vector3(0, yE, frontZ - bevel);
  const endBack = new Vector3(0, yE, backZ + bevel);
  const backCorner = new Vector3(0, y + inward * bevel, zB);
  const backInner = new Vector3(0, y + inward * (bevel + wrapBack), zB);
  path.add(new LineCurve3(frontInner, frontCorner));
  path.add(new QuadraticBezierCurve3(frontCorner, new Vector3(0, yE, zF), endFront));
  path.add(new LineCurve3(endFront, endBack));
  path.add(new QuadraticBezierCurve3(endBack, new Vector3(0, yE, zB), backCorner));
  path.add(new LineCurve3(backCorner, backInner));
  const mesh = add(parent, new TubeGeometry(path, 56, tubeR, 8, false), mat, name, [x, 0, 0]);
  mesh.scale.x = bandScale;
}

function sideButtonStadium(length, width, depth, bevel) {
  const geometry = new ExtrudeGeometry(roundedRectShape(width, length, width * 0.495), {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel * 0.72,
    bevelSegments: 8,
    curveSegments: 28,
  });
  geometry.rotateY(Math.PI / 2);
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function addRealisticSideButton(parent, railX, y, length, name) {
  const width = 0.102;
  const gasket = 0.007;
  const wellDepth = 0.018;
  const faceDepth = 0.02;
  const crown = 0.005;

  const assembly = new Group();
  assembly.name = `${name}Assembly`;
  assembly.position.set(railX, y, 0);

  add(
    assembly,
    sideButtonStadium(length + gasket * 2, width + gasket * 2, wellDepth, 0),
    getShadowVoid(0x050506),
    `${name}Well`,
    [-0.006, 0, 0],
  );

  add(
    assembly,
    sideButtonStadium(length, width, faceDepth, crown),
    getButtonMetal(),
    name,
    [0.016, 0, 0],
  );

  parent.add(assembly);
}

function add(parent, geometry, material, name, position) {
  const mesh = new Mesh(geometry, material);
  mesh.name = name;
  if (position) {
    mesh.position.set(...position);
  }
  parent.add(mesh);
  return mesh;
}

function addLens(parent, x, y, z, radius) {
  const group = new Group();
  group.name = `Lens_${radius.toFixed(3)}`;
  group.position.set(x, y, z);

  add(
    group,
    new CylinderGeometry(radius + 0.016, radius + 0.016, 0.026, 48),
    new MeshStandardMaterial({
      color: new Color(finish.lensRing),
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 0.45,
    }),
    "Housing",
  ).rotation.x = Math.PI / 2;

  add(
    group,
    new CylinderGeometry(radius, radius, 0.016, 48),
    getShadowVoid(finish.lensWell),
    "Well",
    [0, 0, -0.004],
  ).rotation.x = Math.PI / 2;

  add(
    group,
    new CylinderGeometry(radius * 0.78, radius * 0.78, 0.01, 48),
    getSoftGlass(finish.lensGlass),
    "Glass",
    [0, 0, -0.012],
  ).rotation.x = Math.PI / 2;

  add(
    group,
    new CircleGeometry(radius * 0.3, 32),
    getSoftGlass(finish.lensCore),
    "Core",
    [0, 0, -0.018],
  );

  parent.add(group);
}

function buildPhone() {
  const root = new Group();
  root.name = "AndroidPhone";

  const bodyMat = getFrameMetal();
  const backGlassMat = getBackSatin();
  const cameraBarMat = getSoftGlass(0x121416);

  // Target front bbox ~9:19.5 (matches production screenshots / 2D stack frames).
  // Previous 2.34×4.72 read a bit wide/short next to those screens.
  const bodyWidth = 2.135;
  const bodyHeight = 4.72;
  const bodyRadius = 0.29;
  const bodyBevel = 0.04;

  // Midframe construction
  const body = add(
    root,
    extrude(bodyWidth, bodyHeight, bodyRadius, 0.155, bodyBevel),
    bodyMat,
    "Frame",
  );
  body.geometry.computeBoundingBox();
  const bodyBox = body.geometry.boundingBox;
  const frameW = bodyBox.max.x - bodyBox.min.x;
  const frameH = bodyBox.max.y - bodyBox.min.y;
  const frameR = bodyRadius + Math.max(0, (frameW - bodyWidth) / 2);
  // Keep in sync with components/sections/mobile-showcase/phoneFrontLayout.ts
  const frontFrameRim = 0.032;
  const displayBezel = 0.044;
  const glass = insetRounded(frameW, frameH, frameR, frontFrameRim);
  const screen = insetRounded(glass.width, glass.height, glass.radius, displayBezel);
  const screenY = 0;
  const frontZ = bodyBox.max.z + 0.006;
  const bottomY = bodyBox.min.y;
  const bodyW = frameW;

  const backRim = bodyBevel + 0.01;
  const back = insetRounded(frameW, frameH, frameR, backRim);
  const backGlassGeom = roundedScreen(back.width, back.height, back.radius);
  backGlassGeom.rotateY(Math.PI);
  const backNormals = backGlassGeom.attributes.normal;
  for (let i = 0; i < backNormals.count; i += 1) {
    backNormals.setXYZ(i, 0, 0, -1);
  }
  backNormals.needsUpdate = true;
  tintBackGlass(backGlassGeom);
  add(
    root,
    backGlassGeom,
    backGlassMat,
    "BackGlass",
    [0, 0, bodyBox.min.z - 0.002],
  );

  // Front Display Elements
  add(
    root,
    roundedRing(glass, screen),
    getGlossyGlass(finish.glassBezel),
    "GlassBezel",
    [0, screenY, frontZ],
  );

  add(
    root,
    roundedScreen(screen.width, screen.height, screen.radius),
    getShadowVoid(finish.display),
    "Screen",
    [0, screenY, frontZ + 0.002],
  );

  const punchY = screenY + screen.height / 2 - 0.1;
  add(
    root,
    new CircleGeometry(0.032, 32),
    getShadowVoid(0x020202),
    "PunchHole",
    [0, punchY, frontZ + 0.004],
  );
  add(
    root,
    new CircleGeometry(0.013, 24),
    getMatteGlass(0x050B14),
    "PunchLens",
    [0, punchY, frontZ + 0.006],
  );

  const barY = 1.62;
  const barH = 0.56;
  const barW = bodyW - backRim * 2 - 0.14;
  const barR = barH * 0.5;
  const barInset = 0.03;
  const barZ = bodyBox.min.z - 0.03;
  add(
    root,
    extrude(barW, barH, barR, 0.04, 0),
    cameraBarMat,
    "CameraBarFrame",
    [0, barY, barZ],
  );

  add(
    root,
    extrude(barW - barInset * 2, barH - barInset * 2, barR - barInset, 0.006, 0),
    getSoftGlass(finish.cameraLensWindow),
    "CameraLensWindow",
    [0, barY, barZ - 0.022],
  );

  addLens(root, -0.52, barY, barZ - 0.036, 0.155);
  addLens(root, 0, barY, barZ - 0.036, 0.155);
  addLens(root, 0.46, barY, barZ - 0.032, 0.118);
  add(
    root,
    extrude(0.36, 0.44, 0.22, 0.008, 0),
    new MeshStandardMaterial({
      color: new Color(0x8b8e93),
      metalness: 0.85,
      roughness: 0.28,
      envMapIntensity: 0.45,
    }),
    "CameraBarAccent",
    [barW * 0.5 - 0.22, barY, barZ - 0.02],
  );
  add(
    root,
    new CylinderGeometry(0.042, 0.042, 0.008, 28),
    new MeshPhysicalMaterial({
      color: new Color(finish.flash),
      roughness: 0.08,
      metalness: 0.15,
      emissive: new Color(finish.flash),
      emissiveIntensity: 0.45,
      clearcoat: 0.5,
    }),
    "FlashLens",
    [barW * 0.5 - 0.2, barY - 0.14, barZ - 0.03],
  ).rotation.x = Math.PI / 2;

  add(
    root,
    new CylinderGeometry(0.02, 0.02, 0.006, 20),
    getShadowVoid(0x0a0a0f),
    "LaserSensor",
    [barW * 0.5 - 0.2, barY + 0.14, barZ - 0.028],
  ).rotation.x = Math.PI / 2;

  addRealisticSideButton(root, bodyBox.max.x, 0.89, 0.26, "PowerButton");
  addRealisticSideButton(root, bodyBox.max.x, 0.33, 0.57, "VolumeButton");

  const topY = bodyBox.max.y;
  const railX = bodyBox.max.x;

  addBottomCavity(root, 0, bottomY, 0.28, 0.072, 0.1, "USBC_Hole");
  add(
    root,
    insetStadium(0.18, 0.03, 0.012),
    new MeshStandardMaterial({
      color: new Color(finish.usbGold),
      metalness: 1,
      roughness: 0.35,
    }),
    "USBC_Contacts",
    [0, bottomY + 0.02, 0],
  );

  addBottomCavity(root, -0.62, bottomY, 0.34, 0.05, 0.07, "SpeakerLeft");
  addSpeakerGrill(root, -0.62, bottomY, 0.34, 0.05, "SpeakerLeft");
  addBottomCavity(root, 0.64, bottomY, 0.26, 0.046, 0.07, "SpeakerRight");
  addSpeakerGrill(root, 0.64, bottomY, 0.26, 0.046, "SpeakerRight");

  addRailAntenna(root, {
    kind: "end",
    x: 0.26,
    y: bottomY + 0.003,
    frontZ: bodyBox.max.z,
    backZ: bodyBox.min.z,
    bevel: bodyBevel,
    name: "AntennaBottom",
    color: finish.antennaBottom,
  });
  addRailAntenna(root, {
    kind: "end",
    x: 0,
    y: topY - 0.003,
    frontZ: bodyBox.max.z,
    backZ: bodyBox.min.z,
    bevel: bodyBevel,
    name: "AntennaTop",
    color: finish.antennaSide,
  });

  addTopCavity(root, -0.38, topY, 0.034, 0.034, 0.07, "TopMicHole");

  addRailAntenna(root, {
    kind: "side",
    x: -railX + 0.003,
    y: 0.55,
    frontZ: bodyBox.max.z,
    backZ: bodyBox.min.z,
    bevel: bodyBevel,
    name: "AntennaLeftTop",
    color: finish.antennaSide,
  });
  addRailAntenna(root, {
    kind: "side",
    x: -railX + 0.003,
    y: -1.86,
    frontZ: bodyBox.max.z,
    backZ: bodyBox.min.z,
    bevel: bodyBevel,
    name: "AntennaLeftBottom",
    color: finish.antennaSide,
  });
  addRailAntenna(root, {
    kind: "side",
    x: railX - 0.003,
    y: 0.55,
    frontZ: bodyBox.max.z,
    backZ: bodyBox.min.z,
    bevel: bodyBevel,
    name: "AntennaRightTop",
    color: finish.antennaSide,
  });
  addRailAntenna(root, {
    kind: "side",
    x: railX - 0.003,
    y: -1.86,
    frontZ: bodyBox.max.z,
    backZ: bodyBox.min.z,
    bevel: bodyBevel,
    name: "AntennaRightBottom",
    color: finish.antennaSide,
  });

  return root;
}

const scene = new Scene();
scene.add(buildPhone());

scene.updateMatrixWorld(true);
const box3Min = new Vector3(Infinity, Infinity, Infinity);
const box3Max = new Vector3(-Infinity, -Infinity, -Infinity);
scene.traverse((child) => {
  if (!child.isMesh) {
    return;
  }

  child.geometry.computeBoundingBox();
  const { min, max } = child.geometry.boundingBox;
  box3Min.min(min.clone().applyMatrix4(child.matrixWorld));
  box3Max.max(max.clone().applyMatrix4(child.matrixWorld));
});
const size = new Vector3().subVectors(box3Max, box3Min);

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(scene, {
  binary: true,
  onlyVisible: true,
});

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "models");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "android-phone.glb");
writeFileSync(outFile, Buffer.from(glb));

const phone = scene.children[0];
const frameMesh = phone?.getObjectByName("Frame");
frameMesh?.geometry.computeBoundingBox();
const frameBox = frameMesh?.geometry.boundingBox;
const frontW = frameBox ? frameBox.max.x - frameBox.min.x : size.x;
const frontH = frameBox ? frameBox.max.y - frameBox.min.y : size.y;

console.log(
  `Wrote ${outFile} (${Buffer.from(glb).byteLength} bytes, size ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}; front ${frontW.toFixed(3)} x ${frontH.toFixed(3)}, aspect ${(frontW / frontH).toFixed(4)} vs 9/19.5=${(9 / 19.5).toFixed(4)})`,
);
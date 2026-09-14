import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BoxGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  Scene,
  Shape,
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

const obsidian = {
  body: 0x161618,
  bar: 0x1b1b1e,
  lensRing: 0x3a3a40,
  lensWell: 0x09090b,
  lensGlass: 0x101820,
  lensCore: 0x1c2a3c,
  flash: 0xefe4c8,
  port: 0x2a2a2c,
};

function roundedRectShape(width, height, radius) {
  const shape = new Shape();
  const hw = width / 2;
  const hh = height / 2;
  const r = Math.min(radius, hw, hh);

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
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 12,
    curveSegments: 48,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function physical(color, extras = {}) {
  return new MeshPhysicalMaterial({
    color: new Color(color),
    metalness: 0.78,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.4,
    ...extras,
  });
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
    new CylinderGeometry(radius, radius, 0.014, 64),
    physical(obsidian.lensRing, { metalness: 1, roughness: 0.12 }),
    "Ring",
  ).rotation.x = Math.PI / 2;

  add(
    group,
    new CylinderGeometry(radius * 0.82, radius * 0.82, 0.01, 64),
    physical(obsidian.lensWell, { metalness: 0.4, roughness: 0.35, clearcoat: 0.2 }),
    "Well",
    [0, 0, -0.003],
  ).rotation.x = Math.PI / 2;

  add(
    group,
    new CylinderGeometry(radius * 0.7, radius * 0.7, 0.008, 64),
    physical(obsidian.lensGlass, {
      metalness: 0.95,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
    }),
    "Glass",
    [0, 0, -0.006],
  ).rotation.x = Math.PI / 2;

  add(
    group,
    new CircleGeometry(radius * 0.28, 48),
    physical(obsidian.lensCore, { metalness: 0.9, roughness: 0.06 }),
    "Core",
    [0, 0, -0.011],
  );

  parent.add(group);
}

function buildPhone() {
  const root = new Group();
  root.name = "AndroidPhone";

  const bodyMat = physical(obsidian.body);
  const barMat = physical(obsidian.bar, { roughness: 0.12, metalness: 0.86 });
  const buttonMat = physical(obsidian.body, { roughness: 0.16, metalness: 0.88 });

  add(root, extrude(2.16, 4.58, 0.22, 0.14, 0.03), bodyMat, "Body");
  add(
    root,
    extrude(1.9, 4.14, 0.16, 0.004, 0.002),
    physical(0x050505, { metalness: 0.1, roughness: 0.45, clearcoat: 0 }),
    "Screen",
    [0, -0.02, 0.102],
  );

  add(
    root,
    new CircleGeometry(0.042, 40),
    physical(0x0c0c0e, { metalness: 0.5, roughness: 0.22 }),
    "PunchHole",
    [0, 2.0, 0.106],
  );
  add(
    root,
    new CircleGeometry(0.018, 32),
    physical(0x152030, { metalness: 0.9, roughness: 0.06 }),
    "PunchLens",
    [0, 2.0, 0.108],
  );

  add(
    root,
    extrude(1.98, 0.64, 0.3, 0.028, 0.01),
    barMat,
    "CameraBar",
    [0, 1.58, -0.1],
  );

  addLens(root, -0.46, 1.58, -0.12, 0.168);
  addLens(root, 0.02, 1.58, -0.12, 0.168);
  addLens(root, 0.48, 1.58, -0.118, 0.112);

  add(
    root,
    new CylinderGeometry(0.028, 0.028, 0.01, 32),
    physical(obsidian.flash, {
      metalness: 0.28,
      roughness: 0.16,
      emissive: new Color(obsidian.flash),
      emissiveIntensity: 0.18,
    }),
    "Flash",
    [0.76, 1.58, -0.118],
  ).rotation.x = Math.PI / 2;

  add(root, new BoxGeometry(0.02, 0.38, 0.055), buttonMat, "VolumeUp", [
    -1.105, 0.58, 0,
  ]);
  add(root, new BoxGeometry(0.02, 0.24, 0.055), buttonMat, "VolumeDown", [
    -1.105, 0.14, 0,
  ]);
  add(root, new BoxGeometry(0.02, 0.3, 0.055), buttonMat, "Power", [
    1.105, 0.4, 0,
  ]);

  const usb = add(
    root,
    new CylinderGeometry(0.024, 0.024, 0.09, 24),
    physical(obsidian.port, { metalness: 0.9, roughness: 0.24 }),
    "USBC",
    [0, -2.3, 0],
  );
  usb.rotation.z = Math.PI / 2;

  for (let i = 0; i < 9; i += 1) {
    add(
      root,
      new CylinderGeometry(0.008, 0.008, 0.018, 12),
      physical(obsidian.port, { roughness: 0.3 }),
      `Mic_${i}`,
      [-0.2 + i * 0.05, -2.31, 0.02],
    ).rotation.x = Math.PI / 2;
  }

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

console.log(
  `Wrote ${outFile} (${Buffer.from(glb).byteLength} bytes, size ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)})`,
);

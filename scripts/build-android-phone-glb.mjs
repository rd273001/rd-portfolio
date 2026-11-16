import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  CurvePath,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  LineCurve3,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Path,
  QuadraticBezierCurve3,
  RingGeometry,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
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

function extrude(
  width,
  height,
  radius,
  depth,
  bevel,
  curveSegments = 64,
  bevelSegments = 12,
) {
  const geometry = new ExtrudeGeometry(roundedRectShape(width, height, radius), {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: bevel > 0 ? bevelSegments : 1,
    curveSegments,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function roundedScreen(width, height, radius, hole = null) {
  const shape = roundedRectShape(width, height, radius);
  if (hole) {
    const holePath = new Path();
    holePath.absarc(hole.x, hole.y, hole.radius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }
  const geometry = new ShapeGeometry(shape, 64);
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

function stadiumHolePath(cx, width, height) {
  const path = new Path();
  const hw = width / 2;
  const hh = height / 2;
  const r = Math.min(height * 0.49, hw, hh);
  path.moveTo(cx - hw + r, -hh);
  path.absarc(cx - hw + r, -hh + r, r, -Math.PI / 2, Math.PI, true);
  path.lineTo(cx - hw, hh - r);
  path.absarc(cx - hw + r, hh - r, r, Math.PI, Math.PI / 2, true);
  path.lineTo(cx + hw - r, hh);
  path.absarc(cx + hw - r, hh - r, r, Math.PI / 2, 0, true);
  path.lineTo(cx + hw, -hh + r);
  path.absarc(cx + hw - r, -hh + r, r, 0, -Math.PI / 2, true);
  return path;
}

function appendPatchAttributes(patch, keptPos, keptNorm, keptUv) {
  const nonIndexed = patch.index ? patch.toNonIndexed() : patch;
  nonIndexed.computeVertexNormals();
  const pPos = nonIndexed.attributes.position;
  const pNorm = nonIndexed.attributes.normal;
  const pUv = nonIndexed.attributes.uv;
  const v0 = new Vector3();
  const v1 = new Vector3();
  const v2 = new Vector3();
  const e1 = new Vector3();
  const e2 = new Vector3();

  for (let i = 0; i < pPos.count; i += 3) {
    v0.fromBufferAttribute(pPos, i);
    v1.fromBufferAttribute(pPos, i + 1);
    v2.fromBufferAttribute(pPos, i + 2);
    e1.subVectors(v1, v0);
    e2.subVectors(v2, v0);
    // Earcut on curved holes can emit degenerate sliver triangles; skip them so normals stay unit-length.
    if (e1.cross(e2).lengthSq() <= 1e-18) {
      continue;
    }

    for (let k = 0; k < 3; k += 1) {
      const idx = i + k;
      keptPos.push(pPos.getX(idx), pPos.getY(idx), pPos.getZ(idx));
      keptNorm.push(pNorm.getX(idx), pNorm.getY(idx), pNorm.getZ(idx));
      if (pUv) {
        keptUv.push(pUv.getX(idx), pUv.getY(idx));
      } else {
        keptUv.push(0, 0);
      }
    }
  }
}

function cutFrameEndHoles(frameGeometry, { topMic, bottomOpenings, bottomCircles = [] }) {
  const geom = frameGeometry.index ? frameGeometry.toNonIndexed() : frameGeometry;
  geom.computeBoundingBox();
  const maxY = geom.boundingBox.max.y;
  const minY = geom.boundingBox.min.y;
  const pos = geom.attributes.position;
  const norm = geom.attributes.normal;
  const uv = geom.attributes.uv;

  const keptPos = [];
  const keptNorm = [];
  const keptUv = [];
  const topBounds = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity, count: 0 };
  const botBounds = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity, count: 0 };

  for (let i = 0; i < pos.count; i += 3) {
    let isFlatTop = true;
    let isFlatBottom = true;
    for (let k = 0; k < 3; k += 1) {
      const y = pos.getY(i + k);
      const z = pos.getZ(i + k);
      if (y < maxY - 1e-4 || Math.abs(z) > 0.0785) {
        isFlatTop = false;
      }
      if (y > minY + 1e-4 || Math.abs(z) > 0.0785) {
        isFlatBottom = false;
      }
    }

    if (isFlatTop) {
      topBounds.count += 1;
      for (let k = 0; k < 3; k += 1) {
        const x = pos.getX(i + k);
        const z = pos.getZ(i + k);
        topBounds.minX = Math.min(topBounds.minX, x);
        topBounds.maxX = Math.max(topBounds.maxX, x);
        topBounds.minZ = Math.min(topBounds.minZ, z);
        topBounds.maxZ = Math.max(topBounds.maxZ, z);
      }
      continue;
    }

    if (isFlatBottom) {
      botBounds.count += 1;
      for (let k = 0; k < 3; k += 1) {
        const x = pos.getX(i + k);
        const z = pos.getZ(i + k);
        botBounds.minX = Math.min(botBounds.minX, x);
        botBounds.maxX = Math.max(botBounds.maxX, x);
        botBounds.minZ = Math.min(botBounds.minZ, z);
        botBounds.maxZ = Math.max(botBounds.maxZ, z);
      }
      continue;
    }

    for (let k = 0; k < 3; k += 1) {
      const idx = i + k;
      keptPos.push(pos.getX(idx), pos.getY(idx), pos.getZ(idx));
      keptNorm.push(norm.getX(idx), norm.getY(idx), norm.getZ(idx));
      if (uv) {
        keptUv.push(uv.getX(idx), uv.getY(idx));
      } else {
        keptUv.push(0, 0);
      }
    }
  }

  if (topBounds.count === 0 && botBounds.count === 0) {
    return geom;
  }

  if (topBounds.count > 0) {
    const topShape = new Shape();
    topShape.moveTo(topBounds.minX, -topBounds.maxZ);
    topShape.lineTo(topBounds.maxX, -topBounds.maxZ);
    topShape.lineTo(topBounds.maxX, -topBounds.minZ);
    topShape.lineTo(topBounds.minX, -topBounds.minZ);
    topShape.closePath();

    const holePath = new Path();
    holePath.absarc(topMic.x, 0, topMic.radius, 0, Math.PI * 2, true);
    topShape.holes.push(holePath);

    const topPatch = new ShapeGeometry(topShape, 48);
    topPatch.rotateX(-Math.PI / 2);
    topPatch.translate(0, maxY, 0);
    appendPatchAttributes(topPatch, keptPos, keptNorm, keptUv);
  }

  if (botBounds.count > 0) {
    const botShape = new Shape();
    botShape.moveTo(botBounds.minX, botBounds.minZ);
    botShape.lineTo(botBounds.maxX, botBounds.minZ);
    botShape.lineTo(botBounds.maxX, botBounds.maxZ);
    botShape.lineTo(botBounds.minX, botBounds.maxZ);
    botShape.closePath();

    for (const opening of bottomOpenings) {
      botShape.holes.push(stadiumHolePath(opening.x, opening.width, opening.height));
    }

    for (const circle of bottomCircles) {
      const dotHole = new Path();
      dotHole.absarc(circle.x, 0, circle.radius, 0, Math.PI * 2, true);
      botShape.holes.push(dotHole);
    }

    const botPatch = new ShapeGeometry(botShape, 48);
    botPatch.rotateX(Math.PI / 2);
    botPatch.translate(0, minY, 0);
    appendPatchAttributes(botPatch, keptPos, keptNorm, keptUv);
  }

  const merged = new BufferGeometry();
  merged.setAttribute("position", new Float32BufferAttribute(keptPos, 3));
  merged.setAttribute("normal", new Float32BufferAttribute(keptNorm, 3));
  merged.setAttribute("uv", new Float32BufferAttribute(keptUv, 2));
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
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

function addTopMicPinhole(parent, x, topY) {
  const rOuter = 0.023;
  const rInner = 0.0165;
  const chamferH = 0.0055;
  const boreH = 0.016;

  const chamferGeom = new CylinderGeometry(rOuter, rInner, chamferH, 48, 1, true);
  const nAttr = chamferGeom.attributes.normal;
  for (let i = 0; i < nAttr.count; i += 1) {
    const nx = -nAttr.getX(i);
    const ny = Math.abs(nAttr.getY(i));
    const nz = -nAttr.getZ(i);
    const len = Math.hypot(nx, ny, nz) || 1;
    nAttr.setXYZ(i, nx / len, ny / len, nz / len);
  }
  nAttr.needsUpdate = true;

  add(
    parent,
    chamferGeom,
    new MeshPhysicalMaterial({
      color: new Color(0x8c919a),
      metalness: 1,
      roughness: 0.12,
      envMapIntensity: 1.4,
      clearcoat: 0.3,
      side: DoubleSide,
    }),
    "TopMicChamfer",
    [x, topY - chamferH / 2, 0],
  );

  add(
    parent,
    new CylinderGeometry(rInner, rInner, boreH, 48, 1, true),
    new MeshStandardMaterial({
      color: new Color(0x000000),
      roughness: 1,
      metalness: 0,
      envMapIntensity: 0,
      side: DoubleSide,
    }),
    "TopMicBoreWall",
    [x, topY - chamferH - boreH / 2, 0],
  );

  const floorCap = new CircleGeometry(rInner + 0.0005, 48);
  floorCap.rotateX(-Math.PI / 2);
  add(
    parent,
    floorCap,
    new MeshStandardMaterial({
      color: new Color(0x000000),
      roughness: 1,
      metalness: 0,
      envMapIntensity: 0,
    }),
    "TopMicHole",
    [x, topY - chamferH - 0.001, 0],
  );
}

function createArCoatedLensGeometry(radius) {
  const geometry = new SphereGeometry(radius, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
  geometry.rotateX(Math.PI / 2);
  geometry.scale(1, 1, 0.25);
  geometry.computeVertexNormals();

  const normalAttr = geometry.attributes.normal;
  for (let i = 0; i < normalAttr.count; i += 1) {
    const nx = normalAttr.getX(i);
    const ny = normalAttr.getY(i);
    const nz = normalAttr.getZ(i);
    const len = Math.hypot(nx, ny, nz);
    // Unreferenced SphereGeometry pole seam vertex (0, 0, +Z) gets (0, 0, 0) from computeVertexNormals().
    if (len < 1e-6) {
      normalAttr.setXYZ(i, 0, 0, 1);
    } else if (Math.abs(len - 1) > 1e-5) {
      normalAttr.setXYZ(i, nx / len, ny / len, nz / len);
    }
  }
  normalAttr.needsUpdate = true;

  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i += 1) {
    const nx = pos.getX(i) / radius;
    const ny = pos.getY(i) / radius;
    const r = Math.hypot(nx, ny);
    const ring = Math.exp(-Math.pow((r - 0.52) / 0.28, 2));
    const blueW = Math.max(0, -nx * 0.72 + ny * 0.69) * ring;
    const violetW = Math.max(0, nx * 0.82 - ny * 0.57) * ring;

    colors[i * 3] = Math.min(1, 0.015 + blueW * 0.14 + violetW * 0.48);
    colors[i * 3 + 1] = Math.min(1, 0.022 + blueW * 0.38 + violetW * 0.16);
    colors[i * 3 + 2] = Math.min(1, 0.045 + blueW * 0.92 + violetW * 0.78);
  }

  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geometry;
}

function normalizeGeometryNormals(geometry) {
  geometry.computeVertexNormals();
  const normalAttr = geometry.attributes.normal;
  for (let i = 0; i < normalAttr.count; i += 1) {
    const nx = normalAttr.getX(i);
    const ny = normalAttr.getY(i);
    const nz = normalAttr.getZ(i);
    const len = Math.hypot(nx, ny, nz);
    if (len < 1e-6) {
      normalAttr.setXYZ(i, 0, 0, -1);
    } else if (Math.abs(len - 1) > 1e-5) {
      normalAttr.setXYZ(i, nx / len, ny / len, nz / len);
    }
  }
  normalAttr.needsUpdate = true;
}

function buildPolarSurfaceMesh(innerRadius, outerRadius, radialSteps, angularSteps, profileFn) {
  const hasInnerRing = typeof innerRadius === "function" || innerRadius > 1e-6;
  const positions = [];
  const uvs = [];
  const colors = [];
  const indices = [];

  for (let ir = 0; ir <= radialSteps; ir += 1) {
    const t = ir / radialSteps;
    for (let ia = 0; ia <= angularSteps; ia += 1) {
      const theta = (ia / angularSteps) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const rStart = typeof innerRadius === "function" ? innerRadius(cos, sin) : innerRadius;
      const r = rStart + t * (outerRadius - rStart);
      const uvScale = outerRadius > 1e-6 ? r / outerRadius : 0;
      const x = r * cos;
      const y = r * sin;
      const { z, rgb } = profileFn(t, cos, sin);
      positions.push(x, y, z);
      uvs.push(cos * uvScale * 0.5 + 0.5, sin * uvScale * 0.5 + 0.5);
      colors.push(
        Math.min(1, Math.max(0, rgb[0])),
        Math.min(1, Math.max(0, rgb[1])),
        Math.min(1, Math.max(0, rgb[2])),
      );
    }
  }

  const stride = angularSteps + 1;
  for (let ir = 0; ir < radialSteps; ir += 1) {
    for (let ia = 0; ia < angularSteps; ia += 1) {
      const a = ir * stride + ia;
      const b = a + stride;
      const c = b + 1;
      const d = a + 1;
      if (ir > 0 || hasInnerRing) {
        indices.push(a, d, b);
      }
      indices.push(d, c, b);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  normalizeGeometryNormals(geometry);

  // Weld seam normals along theta = 0 / 2*PI so lighting wraps seamlessly around each lens.
  const normalAttr = geometry.attributes.normal;
  for (let ir = 0; ir <= radialSteps; ir += 1) {
    const startIdx = ir * stride;
    const endIdx = startIdx + angularSteps;
    const nx = normalAttr.getX(startIdx) + normalAttr.getX(endIdx);
    const ny = normalAttr.getY(startIdx) + normalAttr.getY(endIdx);
    const nz = normalAttr.getZ(startIdx) + normalAttr.getZ(endIdx);
    const len = Math.hypot(nx, ny, nz);
    if (len < 1e-6) {
      normalAttr.setXYZ(startIdx, 0, 0, -1);
      normalAttr.setXYZ(endIdx, 0, 0, -1);
    } else {
      normalAttr.setXYZ(startIdx, nx / len, ny / len, nz / len);
      normalAttr.setXYZ(endIdx, nx / len, ny / len, nz / len);
    }
  }
  normalAttr.needsUpdate = true;

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function buildPolarOpticalMesh(radius, radialSteps, angularSteps, profileFn) {
  return buildPolarSurfaceMesh(0, radius, radialSteps, angularSteps, profileFn);
}

function smoothstepRange(edge0, edge1, x) {
  const u = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return u * u * (3 - 2 * u);
}

function createOpticalLensDomeGeometry(radius, depthScale = 0.068, kind = "wide") {
  const pupilRadius = kind === "telephoto" ? 0.28 : kind === "ultrawide" ? 0.2 : 0.24;
  const innerRing = kind === "ultrawide" ? 0.29 : kind === "telephoto" ? 0.4 : 0.34;
  const midRing = kind === "ultrawide" ? 0.52 : kind === "telephoto" ? 0.62 : 0.58;
  const outerRing = kind === "ultrawide" ? 0.74 : kind === "telephoto" ? 0.79 : 0.76;

  const primaryTint =
    kind === "ultrawide"
      ? [0.009, 0.032, 0.056]
      : kind === "telephoto"
        ? [0.022, 0.015, 0.058]
        : [0.012, 0.026, 0.066];
  const counterTint =
    kind === "ultrawide"
      ? [0.014, 0.012, 0.036]
      : kind === "telephoto"
        ? [0.024, 0.011, 0.042]
        : [0.018, 0.009, 0.034];
  const rimTint =
    kind === "ultrawide"
      ? [0.012, 0.028, 0.038]
      : kind === "telephoto"
        ? [0.018, 0.02, 0.04]
        : [0.014, 0.024, 0.038];

  return buildPolarOpticalMesh(radius, 36, 64, (t, cos, sin) => {
    const stepOffset = t < pupilRadius ? 0.0006 * (1 - t / pupilRadius) : 0;
    const z = -Math.cos(t * Math.PI * 0.5) * radius * depthScale + stepOffset;

    const pupilSmooth = smoothstepRange(pupilRadius - 0.04, pupilRadius + 0.1, t);
    const primaryDir = Math.max(0, -cos * 0.65 + sin * 0.76);
    const secondaryDir = Math.max(0, cos * 0.65 - sin * 0.76);

    // Fine inner element aperture hairline right outside the dark smoked pupil
    const innerRimBand = Math.exp(-Math.pow((t - (pupilRadius + 0.03)) / 0.045, 2));
    const innerRimDir = 0.18 + 0.82 * Math.pow(primaryDir, 1.4);
    const rimWeight = innerRimBand * innerRimDir;

    // Strictly directional, desaturated role-specific AR coating crescents
    const primaryBand = Math.exp(-Math.pow((t - midRing) / 0.16, 2));
    const counterBand = Math.exp(-Math.pow((t - outerRing) / 0.15, 2));
    const primaryWeight = primaryBand * Math.pow(primaryDir, 1.8) * pupilSmooth;
    const counterWeight = counterBand * Math.pow(secondaryDir, 1.6) * pupilSmooth;

    // Pinpoint silver-ice specular catchlight & opposite sub-element ghost reflection
    const pinpoint =
      Math.exp(-Math.pow((t - (innerRing + 0.08)) / 0.065, 2)) *
      Math.pow(primaryDir, 8.0) *
      pupilSmooth;
    const ghostDot =
      Math.exp(-Math.pow((t - (midRing + 0.06)) / 0.07, 2)) *
      Math.pow(secondaryDir, 6.5) *
      pupilSmooth;

    const r =
      0.0008 +
      rimWeight * rimTint[0] +
      primaryWeight * primaryTint[0] +
      counterWeight * counterTint[0] +
      pinpoint * 0.24 +
      ghostDot * 0.032;
    const g =
      0.0011 +
      rimWeight * rimTint[1] +
      primaryWeight * primaryTint[1] +
      counterWeight * counterTint[1] +
      pinpoint * 0.29 +
      ghostDot * 0.04;
    const b =
      0.0018 +
      rimWeight * rimTint[2] +
      primaryWeight * primaryTint[2] +
      counterWeight * counterTint[2] +
      pinpoint * 0.38 +
      ghostDot * 0.058;

    return {
      z,
      rgb: [r, g, b],
    };
  });
}

function createPeriscopeApertureGeometry(halfW, halfH, outerRadius) {
  return buildPolarSurfaceMesh(
    (cos, sin) =>
      Math.pow(
        Math.pow(Math.abs(cos) / halfW, 4.2) + Math.pow(Math.abs(sin) / halfH, 4.2),
        -1 / 4.2,
      ),
    outerRadius,
    16,
    64,
    (t, cos, sin) => {
      const bevel = Math.exp(-Math.pow((t - 0.08) / 0.09, 2));
      const z = -bevel * 0.00075;
      const hemi = 0.5 + 0.5 * (-cos * 0.65 + sin * 0.76);
      const lipShade = (0.35 + 0.65 * hemi) * bevel;
      const collarFade = 1 - bevel;

      return {
        z,
        rgb: [
          lipShade * 0.022 + collarFade * 0.0025,
          lipShade * 0.025 + collarFade * 0.003,
          lipShade * 0.032 + collarFade * 0.004,
        ],
      };
    },
  );
}

function createSteppedBaffleGeometry(innerRadius, outerRadius, kind = "wide") {
  const phase = kind === "ultrawide" ? 0.35 : kind === "telephoto" ? 0.7 : 0;
  return buildPolarSurfaceMesh(innerRadius, outerRadius, 28, 64, (t, cos, sin) => {
    const ridgeMask = 0.5 + 0.5 * Math.cos(t * Math.PI * 4 + phase);
    const innerLip = Math.exp(-Math.pow((t - 0.07) / 0.07, 2));
    const z = -ridgeMask * 0.0008 - innerLip * 0.00095;

    const hemi = 0.5 + 0.5 * (-cos * 0.65 + sin * 0.76);
    const directional = 0.65 + 0.35 * hemi;
    const ridgeMix = Math.min(1, ridgeMask * 0.8 + innerLip * 0.9);

    const r = 0.0035 + ridgeMix * directional * 0.009;
    const g = 0.004 + ridgeMix * directional * 0.0105;
    const b = 0.005 + ridgeMix * directional * 0.013;
    return {
      z,
      rgb: [r, g, b],
    };
  });
}

function createTopCoverGlassGeometry(radius) {
  return buildPolarOpticalMesh(radius, 24, 64, (t, cos, sin) => {
    // Smooth shallow spherical glass crown so real-time clearcoat and HDRI glide without painted stripes
    const z = -Math.cos(t * Math.PI * 0.5) * radius * 0.018;
    const d = t * (-cos * 0.6 + sin * 0.8);
    const hemi = 0.5 + 0.5 * d;
    const radialFresnel = Math.pow(t, 2.4) * (0.25 + 0.75 * hemi);
    const meniscus = Math.exp(-Math.pow((t - 0.95) / 0.038, 2)) * (0.3 + 0.7 * hemi);
    const sheen = radialFresnel * 0.055 + meniscus * 0.085;

    return {
      z,
      rgb: [0.001 + sheen * 0.78, 0.0014 + sheen * 0.88, 0.002 + sheen * 1.0],
    };
  });
}

function stripFrontCapTriangles(geometry) {
  const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry;
  nonIndexed.computeBoundingBox();
  const minZ = nonIndexed.boundingBox.min.z;
  const pos = nonIndexed.attributes.position;
  const norm = nonIndexed.attributes.normal;
  const uv = nonIndexed.attributes.uv;
  const keptPos = [];
  const keptNorm = [];
  const keptUv = [];

  for (let i = 0; i < pos.count; i += 3) {
    const z0 = pos.getZ(i);
    const z1 = pos.getZ(i + 1);
    const z2 = pos.getZ(i + 2);
    if (z0 <= minZ + 1e-4 && z1 <= minZ + 1e-4 && z2 <= minZ + 1e-4) {
      continue;
    }
    for (let k = 0; k < 3; k += 1) {
      const idx = i + k;
      keptPos.push(pos.getX(idx), pos.getY(idx), pos.getZ(idx));
      keptNorm.push(norm.getX(idx), norm.getY(idx), norm.getZ(idx));
      if (uv) {
        keptUv.push(uv.getX(idx), uv.getY(idx));
      } else {
        keptUv.push(0, 0);
      }
    }
  }

  const out = new BufferGeometry();
  out.setAttribute("position", new Float32BufferAttribute(keptPos, 3));
  out.setAttribute("normal", new Float32BufferAttribute(keptNorm, 3));
  out.setAttribute("uv", new Float32BufferAttribute(keptUv, 2));
  normalizeGeometryNormals(out);
  out.computeBoundingBox();
  out.computeBoundingSphere();
  return out;
}

function createPlateauWindowGeometry(width, height, radius, depth, holes = []) {
  const shape = roundedRectShape(width, height, radius);
  for (const h of holes) {
    const holePath = new Path();
    holePath.absarc(h.x, h.y, h.radius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }
  const raw = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 64,
  });
  raw.center();
  const nonIndexed = raw.index ? raw.toNonIndexed() : raw;
  nonIndexed.computeVertexNormals();
  const pos = nonIndexed.attributes.position;
  const norm = nonIndexed.attributes.normal;
  const uv = nonIndexed.attributes.uv;
  const keptPos = [];
  const keptNorm = [];
  const keptUv = [];
  const v0 = new Vector3();
  const v1 = new Vector3();
  const v2 = new Vector3();
  const e1 = new Vector3();
  const e2 = new Vector3();

  for (let i = 0; i < pos.count; i += 3) {
    v0.fromBufferAttribute(pos, i);
    v1.fromBufferAttribute(pos, i + 1);
    v2.fromBufferAttribute(pos, i + 2);
    e1.subVectors(v1, v0);
    e2.subVectors(v2, v0);
    const cross = e1.cross(e2);
    if (cross.lengthSq() <= 1e-18) {
      continue;
    }
    cross.normalize();
    for (let k = 0; k < 3; k += 1) {
      const idx = i + k;
      keptPos.push(pos.getX(idx), pos.getY(idx), pos.getZ(idx));
      const nx = norm.getX(idx);
      const ny = norm.getY(idx);
      const nz = norm.getZ(idx);
      const len = Math.hypot(nx, ny, nz);
      if (len < 1e-5) {
        keptNorm.push(cross.x, cross.y, cross.z);
      } else {
        keptNorm.push(nx / len, ny / len, nz / len);
      }
      if (uv) {
        keptUv.push(uv.getX(idx), uv.getY(idx));
      } else {
        keptUv.push(0, 0);
      }
    }
  }

  const out = new BufferGeometry();
  out.setAttribute("position", new Float32BufferAttribute(keptPos, 3));
  out.setAttribute("normal", new Float32BufferAttribute(keptNorm, 3));
  out.setAttribute("uv", new Float32BufferAttribute(keptUv, 2));
  out.computeBoundingBox();
  out.computeBoundingSphere();
  return out;
}

function createFlashDiffuserGeometry(radius) {
  return buildPolarOpticalMesh(radius, 44, 64, (t, cos, sin) => {
    const ringPhase = (t * 5.5) % 1;
    const tooth = ringPhase < 0.72 ? ringPhase / 0.72 : (1 - ringPhase) / 0.28;
    const z = -Math.cos(t * Math.PI * 0.5) * 0.0018 - tooth * 0.00055;

    const radialSeg = 0.92 + 0.08 * Math.cos(Math.atan2(sin, cos) * 16);
    const keySheen = 0.9 + 0.14 * Math.max(0, -cos * 0.55 + sin * 0.83);
    const crestMix = Math.pow(tooth, 1.35);
    const collarGroove = 1 - 0.45 * Math.exp(-Math.pow((t - 0.28) / 0.024, 2));

    const prismR = (0.15 + crestMix * 0.29) * radialSeg * keySheen * collarGroove;
    const prismG = (0.16 + crestMix * 0.3) * radialSeg * keySheen * collarGroove;
    const prismB = (0.18 + crestMix * 0.32) * radialSeg * keySheen * collarGroove;

    const coreMask = 1 - smoothstepRange(0.18, 0.32, t);
    const coreScale = radialSeg * keySheen;
    const midR = prismR * (1 - coreMask) + 0.48 * coreScale * coreMask;
    const midG = prismG * (1 - coreMask) + 0.36 * coreScale * coreMask;
    const midB = prismB * (1 - coreMask) + 0.21 * coreScale * coreMask;

    const edgeKeep = 1 - smoothstepRange(0.9, 1.0, t);
    const r = midR * edgeKeep + 0.035 * (1 - edgeKeep);
    const g = midG * edgeKeep + 0.038 * (1 - edgeKeep);
    const b = midB * edgeKeep + 0.045 * (1 - edgeKeep);
    return {
      z,
      rgb: [r, g, b],
    };
  });
}

function addFrontPunchHole(parent, x, y, screenZ, outerRadius) {
  add(
    parent,
    new CircleGeometry(outerRadius + 0.001, 48),
    new MeshStandardMaterial({
      color: new Color(0x000000),
      roughness: 1,
      metalness: 0,
      envMapIntensity: 0,
    }),
    "PunchWell",
    [x, y, screenZ - 0.0068],
  );

  const outerWall = new CylinderGeometry(outerRadius, outerRadius, 0.0068, 48, 1, true);
  outerWall.rotateX(Math.PI / 2);
  add(
    parent,
    outerWall,
    new MeshStandardMaterial({
      color: new Color(0x020203),
      roughness: 0.9,
      metalness: 0.05,
      envMapIntensity: 0.05,
      side: DoubleSide,
    }),
    "PunchOuterWall",
    [x, y, screenZ - 0.0034],
  );

  add(
    parent,
    new RingGeometry(0.0315, outerRadius + 0.0004, 48),
    new MeshStandardMaterial({
      color: new Color(0x020203),
      roughness: 0.95,
      metalness: 0.02,
      envMapIntensity: 0.05,
    }),
    "PunchOuterRing",
    [x, y, screenZ - 0.0004],
  );

  const barrelWall = new CylinderGeometry(0.0315, 0.0315, 0.0028, 48, 1, true);
  barrelWall.rotateX(Math.PI / 2);
  add(
    parent,
    barrelWall,
    new MeshStandardMaterial({
      color: new Color(0x141518),
      roughness: 0.6,
      metalness: 0.2,
      envMapIntensity: 0.2,
      side: DoubleSide,
    }),
    "PunchBarrelWall",
    [x, y, screenZ - 0.0018],
  );

  add(
    parent,
    new RingGeometry(0.0195, 0.0315, 48),
    new MeshStandardMaterial({
      color: new Color(0x222428),
      roughness: 0.55,
      metalness: 0.22,
      envMapIntensity: 0.35,
    }),
    "PunchBarrel",
    [x, y, screenZ - 0.0032],
  );

  const barrelChamfer = new CylinderGeometry(0.0195, 0.0148, 0.003, 48, 1, true);
  barrelChamfer.rotateX(Math.PI / 2);
  add(
    parent,
    barrelChamfer,
    new MeshStandardMaterial({
      color: new Color(0x181a1e),
      roughness: 0.45,
      metalness: 0.28,
      envMapIntensity: 0.45,
      side: DoubleSide,
    }),
    "PunchBarrelChamfer",
    [x, y, screenZ - 0.0047],
  );

  add(
    parent,
    createArCoatedLensGeometry(0.0148),
    new MeshPhysicalMaterial({
      color: new Color(0xffffff),
      vertexColors: true,
      metalness: 0.08,
      roughness: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 0.75,
      emissive: new Color(0x040710),
      emissiveIntensity: 0.15,
    }),
    "PunchLens",
    [x, y, screenZ - 0.0062],
  );
}

function createStadiumFrustum(outerW, outerH, innerW, innerH, depth, segments = 48) {
  const outerPts = roundedRectShape(outerW, outerH, Math.min(outerH * 0.49, outerW * 0.49))
    .getSpacedPoints(segments)
    .slice(0, segments);
  const innerPts = roundedRectShape(innerW, innerH, Math.min(innerH * 0.49, innerW * 0.49))
    .getSpacedPoints(segments)
    .slice(0, segments);

  const ringNormals = [];
  for (let k = 0; k < segments; k += 1) {
    const prev = (k - 1 + segments) % segments;
    const next = (k + 1) % segments;
    const tangent = new Vector3(
      outerPts[next].x - outerPts[prev].x,
      0,
      outerPts[next].y - outerPts[prev].y,
    );
    const slant = new Vector3(
      innerPts[k].x - outerPts[k].x,
      depth,
      innerPts[k].y - outerPts[k].y,
    );
    const n = new Vector3().crossVectors(tangent, slant);
    if (n.lengthSq() > 0) {
      n.normalize();
    } else {
      n.set(0, -1, 0);
    }
    ringNormals.push(n);
  }

  const positions = [];
  const normals = [];
  const uvs = [];

  for (let i = 0; i < segments; i += 1) {
    const j = (i + 1) % segments;
    const o0 = outerPts[i];
    const o1 = outerPts[j];
    const i0 = innerPts[i];
    const i1 = innerPts[j];
    const n0 = ringNormals[i];
    const n1 = ringNormals[j];
    const u0 = i / segments;
    const u1 = (i + 1) / segments;

    // Triangle 1: o0 -> o1 -> i1
    positions.push(o0.x, 0, o0.y, o1.x, 0, o1.y, i1.x, depth, i1.y);
    normals.push(n0.x, n0.y, n0.z, n1.x, n1.y, n1.z, n1.x, n1.y, n1.z);
    uvs.push(u0, 0, u1, 0, u1, 1);

    // Triangle 2: o0 -> i1 -> i0
    positions.push(o0.x, 0, o0.y, i1.x, depth, i1.y, i0.x, depth, i0.y);
    normals.push(n0.x, n0.y, n0.z, n1.x, n1.y, n1.z, n0.x, n0.y, n0.z);
    uvs.push(u0, 0, u1, 1, u0, 1);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function addUsbCPort(parent, x, bottomY) {
  const chamferH = 0.0055;
  const boreH = 0.086;

  add(
    parent,
    createStadiumFrustum(0.296, 0.086, 0.278, 0.068, chamferH, 56),
    new MeshPhysicalMaterial({
      color: new Color(0x8c919a),
      metalness: 1,
      roughness: 0.14,
      envMapIntensity: 1.35,
      clearcoat: 0.3,
      side: DoubleSide,
    }),
    "USBC_Chamfer",
    [x, bottomY, 0],
  );

  add(
    parent,
    createStadiumFrustum(0.278, 0.068, 0.278, 0.068, boreH, 56),
    new MeshStandardMaterial({
      color: new Color(0x050608),
      roughness: 0.85,
      metalness: 0.2,
      envMapIntensity: 0.05,
      side: DoubleSide,
    }),
    "USBC_BoreWall",
    [x, bottomY + chamferH, 0],
  );

  const floorGeom = new ShapeGeometry(roundedRectShape(0.282, 0.072, 0.035), 32);
  floorGeom.rotateX(Math.PI / 2);
  add(
    parent,
    floorGeom,
    new MeshStandardMaterial({
      color: new Color(0x000000),
      roughness: 1,
      metalness: 0,
      envMapIntensity: 0,
      side: DoubleSide,
    }),
    "USBC_Floor",
    [x, bottomY + 0.091, 0],
  );

  add(
    parent,
    insetStadium(0.196, 0.018, 0.072),
    new MeshStandardMaterial({
      color: new Color(0x121316),
      roughness: 0.6,
      metalness: 0.15,
      envMapIntensity: 0.15,
    }),
    "USBC_Tongue",
    [x, bottomY + 0.016, 0],
  );

  const tongueTipGeom = new ShapeGeometry(roundedRectShape(0.188, 0.012, 0.005), 24);
  tongueTipGeom.rotateX(Math.PI / 2);
  add(
    parent,
    tongueTipGeom,
    getPolishedMetal(0x4a4d54),
    "USBC_TongueTip",
    [x, bottomY + 0.0155, 0],
  );

  const pinMat = new MeshStandardMaterial({
    color: new Color(finish.usbGold),
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 0.85,
  });

  const pinCountPerSide = 6;
  const pinGeom = new BoxGeometry(0.014, 0.052, 0.0025);
  for (let i = 0; i < pinCountPerSide; i += 1) {
    const t = i / (pinCountPerSide - 1) - 0.5;
    const px = x + t * 0.144;
    add(parent, pinGeom, pinMat, `USBC_PinTop${i}`, [px, bottomY + 0.044, 0.0095]);
    add(parent, pinGeom, pinMat, `USBC_PinBottom${i}`, [px, bottomY + 0.044, -0.0095]);
  }
}

function getSpeakerDotCenters(cx, count = 5, spacing = 0.068) {
  const coords = [];
  const half = (count - 1) / 2;
  for (let i = 0; i < count; i += 1) {
    coords.push(cx + (i - half) * spacing);
  }
  return coords;
}

function addBottomSpeakerDots(parent, cx, bottomY, count, spacing, rOuter, name) {
  const rInner = rOuter * 0.72;
  const chamferH = 0.0045;
  const boreH = 0.016;
  const dotCenters = getSpeakerDotCenters(cx, count, spacing);

  const chamferMat = new MeshPhysicalMaterial({
    color: new Color(0x8c919a),
    metalness: 1,
    roughness: 0.12,
    envMapIntensity: 1.4,
    clearcoat: 0.3,
    side: DoubleSide,
  });
  const boreMat = new MeshStandardMaterial({
    color: new Color(0x000000),
    roughness: 1,
    metalness: 0,
    envMapIntensity: 0,
    side: DoubleSide,
  });
  const holeMat = new MeshStandardMaterial({
    color: new Color(0x000000),
    roughness: 1,
    metalness: 0,
    envMapIntensity: 0,
  });

  for (let i = 0; i < dotCenters.length; i += 1) {
    const dotX = dotCenters[i];
    const chamferGeom = new CylinderGeometry(rInner, rOuter, chamferH, 32, 1, true);
    const nAttr = chamferGeom.attributes.normal;
    for (let k = 0; k < nAttr.count; k += 1) {
      const nx = -nAttr.getX(k);
      const ny = -Math.abs(nAttr.getY(k));
      const nz = -nAttr.getZ(k);
      const len = Math.hypot(nx, ny, nz) || 1;
      nAttr.setXYZ(k, nx / len, ny / len, nz / len);
    }
    nAttr.needsUpdate = true;

    add(parent, chamferGeom, chamferMat, `${name}Dot${i}Chamfer`, [dotX, bottomY + chamferH / 2, 0]);

    add(
      parent,
      new CylinderGeometry(rInner, rInner, boreH, 32, 1, true),
      boreMat,
      `${name}Dot${i}BoreWall`,
      [dotX, bottomY + chamferH + boreH / 2, 0],
    );

    const floorCap = new CircleGeometry(rInner + 0.0005, 32);
    floorCap.rotateX(Math.PI / 2);
    add(parent, floorCap, holeMat, `${name}Dot${i}Hole`, [dotX, bottomY + chamferH + 0.002, 0]);
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

function addLens(parent, x, y, faceZ, radius, options = {}) {
  const group = new Group();
  group.name = options.name ?? `Lens_${radius.toFixed(3)}`;
  group.position.set(x, y, faceZ);
  const kind = options.kind ?? "wide";
  const outerRadius = radius + 0.026;

  const shadowTrench = new RingGeometry(outerRadius, outerRadius + 0.005, 64);
  shadowTrench.rotateY(Math.PI);
  add(
    group,
    shadowTrench,
    new MeshStandardMaterial({
      color: new Color(0x060709),
      roughness: 0.92,
      metalness: 0,
      envMapIntensity: 0,
    }),
    "LensShadowTrench",
    [0, 0, -0.0004],
  );

  const outerWall = new CylinderGeometry(outerRadius, outerRadius, 0.02, 64, 1, true);
  outerWall.rotateX(-Math.PI / 2);
  add(
    group,
    outerWall,
    new MeshPhysicalMaterial({
      color: new Color(0x1f2228),
      metalness: 0.88,
      roughness: 0.2,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
      envMapIntensity: 0.85,
      side: DoubleSide,
    }),
    "OuterCylinderWall",
    [0, 0, -0.0095],
  );

  const outerChamfer = new CylinderGeometry(outerRadius - 0.003, outerRadius, 0.0022, 64, 1, true);
  outerChamfer.rotateX(-Math.PI / 2);
  add(
    group,
    outerChamfer,
    new MeshPhysicalMaterial({
      color: new Color(0x3a3e47),
      metalness: 0.92,
      roughness: 0.16,
      clearcoat: 0.4,
      clearcoatRoughness: 0.16,
      envMapIntensity: 0.95,
      side: DoubleSide,
    }),
    "OuterBezelChamfer",
    [0, 0, -0.0206],
  );

  const bezelRim = new RingGeometry(radius + 0.004, outerRadius - 0.003, 64);
  bezelRim.rotateY(Math.PI);
  add(
    group,
    bezelRim,
    new MeshPhysicalMaterial({
      color: new Color(0x2c3038),
      metalness: 0.9,
      roughness: 0.18,
      clearcoat: 0.35,
      clearcoatRoughness: 0.18,
      envMapIntensity: 0.9,
    }),
    "BezelRim",
    [0, 0, -0.0217],
  );

  const bezelChamfer = new CylinderGeometry(radius + 0.004, radius, 0.0065, 64, 1, true);
  bezelChamfer.rotateX(-Math.PI / 2);
  add(
    group,
    bezelChamfer,
    new MeshPhysicalMaterial({
      color: new Color(0x464b55),
      metalness: 0.92,
      roughness: 0.16,
      clearcoat: 0.35,
      clearcoatRoughness: 0.18,
      envMapIntensity: 0.95,
      side: DoubleSide,
    }),
    "BezelChamfer",
    [0, 0, -0.01845],
  );

  // Layer 0: Top sapphire cover glass recessed just inside the bezel lip
  add(
    group,
    createTopCoverGlassGeometry(radius + 0.0008),
    new MeshPhysicalMaterial({
      color: new Color(0xffffff),
      vertexColors: true,
      transparent: true,
      opacity: 0.14,
      roughness: 0.06,
      metalness: 0.04,
      ior: 1.77,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMapIntensity: 0.75,
    }),
    "LensCoverGlass",
    [0, 0, -0.0162],
  );

  // 4-layer role-differentiated stepped optical barrels descending into +Z (clear of BackGlass at +0.0505)
  const z1 = kind === "telephoto" ? 0.0065 : kind === "ultrawide" ? 0.004 : 0.005;
  const z2 = kind === "telephoto" ? 0.0165 : kind === "ultrawide" ? 0.012 : 0.0135;
  const coreSeatZ = kind === "telephoto" ? 0.03 : kind === "ultrawide" ? 0.022 : 0.025;
  const step1Ratio = kind === "ultrawide" ? 0.62 : kind === "telephoto" ? 0.7 : 0.77;
  const step2OuterRatio = step1Ratio - 0.04;
  const coreOuterRatio = kind === "ultrawide" ? 0.34 : kind === "telephoto" ? 0.46 : 0.54;
  const coreInnerRatio = coreOuterRatio - 0.06;
  const domeDepthScale = kind === "ultrawide" ? 0.105 : kind === "telephoto" ? 0.042 : 0.068;

  // Layer 1: Deep outer bore wall & matte charcoal outer shelf
  const boreTopZ = -0.0155;
  const boreBottomZ = z1 + 0.0005;
  const boreHeight = boreBottomZ - boreTopZ;
  const wellBoreWall = new CylinderGeometry(radius, radius, boreHeight, 64, 1, true);
  wellBoreWall.rotateX(-Math.PI / 2);
  add(
    group,
    wellBoreWall,
    new MeshStandardMaterial({
      color: new Color(0x050608),
      roughness: 0.94,
      metalness: 0.04,
      envMapIntensity: 0,
      side: DoubleSide,
    }),
    "WellBoreWall",
    [0, 0, (boreTopZ + boreBottomZ) * 0.5],
  );

  const outerBaffleStep = new RingGeometry(radius * step1Ratio, radius + 0.001, 64);
  outerBaffleStep.rotateY(Math.PI);
  add(
    group,
    outerBaffleStep,
    new MeshStandardMaterial({
      color: new Color(0x07090c),
      roughness: 0.92,
      metalness: 0.04,
      envMapIntensity: 0.02,
    }),
    "OuterBaffleStep",
    [0, 0, z1],
  );

  // Concentric dark graphite sloped wall stepping down from Layer 1 (z1) to Layer 2 (z2)
  const outerStepChamfer = new CylinderGeometry(
    radius * step1Ratio,
    radius * step2OuterRatio,
    z2 - z1,
    64,
    1,
    true,
  );
  outerStepChamfer.rotateX(-Math.PI / 2);
  add(
    group,
    outerStepChamfer,
    new MeshStandardMaterial({
      color: new Color(0x181c24),
      metalness: 0.55,
      roughness: 0.42,
      envMapIntensity: 0.28,
      side: DoubleSide,
    }),
    "OuterStepChamfer",
    [0, 0, (z1 + z2) * 0.5],
  );

  // Layer 2: Recessed concentric micro-grooved matte graphite barrel shelf & conical drop
  add(
    group,
    createSteppedBaffleGeometry(
      radius * coreOuterRatio,
      radius * (step2OuterRatio + 0.004),
      kind,
    ),
    new MeshStandardMaterial({
      color: new Color(0xffffff),
      vertexColors: true,
      roughness: 0.68,
      metalness: 0.22,
      envMapIntensity: 0.14,
    }),
    "InternalBaffle",
    [0, 0, z2],
  );

  const innerDropHeight = coreSeatZ - z2;
  const apertureChamfer = new CylinderGeometry(
    radius * coreOuterRatio,
    radius * coreInnerRatio,
    innerDropHeight,
    64,
    1,
    true,
  );
  apertureChamfer.rotateX(-Math.PI / 2);
  add(
    group,
    apertureChamfer,
    new MeshStandardMaterial({
      color: new Color(0x161a22),
      roughness: 0.42,
      metalness: 0.52,
      envMapIntensity: 0.28,
      side: DoubleSide,
    }),
    "ApertureChamfer",
    [0, 0, (z2 + coreSeatZ) * 0.5],
  );

  // Layer 3: Machined gunmetal retaining ring framing the deep core optic
  const coreRetainingRing = new RingGeometry(
    radius * (coreInnerRatio - 0.008),
    radius * (coreInnerRatio + 0.02),
    64,
  );
  coreRetainingRing.rotateY(Math.PI);
  add(
    group,
    coreRetainingRing,
    new MeshPhysicalMaterial({
      color: new Color(0x2e3442),
      metalness: 0.84,
      roughness: 0.2,
      clearcoat: 0.3,
      clearcoatRoughness: 0.22,
      envMapIntensity: 0.65,
    }),
    "CoreRetainingRing",
    [0, 0, kind === "telephoto" ? coreSeatZ - 0.0024 : coreSeatZ - 0.0005],
  );

  if (kind === "telephoto") {
    add(
      group,
      createPeriscopeApertureGeometry(
        radius * 0.31,
        radius * 0.23,
        radius * (coreInnerRatio + 0.01),
      ),
      new MeshStandardMaterial({
        color: new Color(0xffffff),
        vertexColors: true,
        roughness: 0.42,
        metalness: 0.48,
        envMapIntensity: 0.25,
      }),
      "TelephotoPrismMask",
      [0, 0, coreSeatZ - 0.0021],
    );
  }

  // Layer 4: Deeply recessed role-differentiated smoked multi-coated optical lens core
  add(
    group,
    createOpticalLensDomeGeometry(radius * (coreInnerRatio + 0.003), domeDepthScale, kind),
    new MeshPhysicalMaterial({
      color: new Color(0xffffff),
      vertexColors: true,
      roughness: 0.14,
      metalness: 0.04,
      clearcoat: 0.65,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.22,
    }),
    "InnerLensDome",
    [0, 0, coreSeatZ],
  );

  const wellFloor = new CircleGeometry(radius + 0.001, 64);
  wellFloor.rotateY(Math.PI);
  add(
    group,
    wellFloor,
    new MeshStandardMaterial({
      color: new Color(0x010102),
      roughness: 1,
      metalness: 0,
      envMapIntensity: 0,
    }),
    "WellFloor",
    [0, 0, coreSeatZ + 0.002],
  );

  parent.add(group);
}

function createBackLogoRDGeometry() {
  const thetaLeg = -1.16;
  const rBowlCx = -0.112;
  const rBowlCy = 0.059;
  const rBowlOuterX = 0.094;
  const rBowlOuterY = 0.071;

  const rShape = new Shape();
  rShape.moveTo(-0.258, -0.13);
  rShape.lineTo(-0.134, -0.13);
  rShape.lineTo(-0.134, -0.108);
  rShape.quadraticCurveTo(-0.168, -0.108, -0.168, -0.084);
  rShape.lineTo(-0.168, -0.012);
  rShape.lineTo(-0.128, -0.012);
  rShape.lineTo(-0.068, -0.13);
  rShape.lineTo(-0.004, -0.13);
  rShape.lineTo(-0.004, -0.108);
  rShape.quadraticCurveTo(-0.024, -0.108, -0.036, -0.086);
  rShape.lineTo(
    rBowlCx + rBowlOuterX * Math.cos(thetaLeg),
    rBowlCy + rBowlOuterY * Math.sin(thetaLeg),
  );
  rShape.absellipse(
    rBowlCx,
    rBowlCy,
    rBowlOuterX,
    rBowlOuterY,
    thetaLeg,
    Math.PI / 2,
    false,
    0,
  );
  rShape.lineTo(-0.258, 0.13);
  rShape.lineTo(-0.258, 0.108);
  rShape.quadraticCurveTo(-0.224, 0.108, -0.224, 0.084);
  rShape.lineTo(-0.224, -0.084);
  rShape.quadraticCurveTo(-0.224, -0.108, -0.258, -0.108);
  rShape.closePath();

  const rHole = new Path();
  rHole.moveTo(-0.168, 0.018);
  rHole.lineTo(-0.168, 0.1);
  rHole.lineTo(-0.126, 0.1);
  rHole.absellipse(-0.126, 0.059, 0.048, 0.041, Math.PI / 2, -Math.PI / 2, true, 0);
  rHole.closePath();
  rShape.holes.push(rHole);

  const dShape = new Shape();
  dShape.moveTo(0.004, -0.13);
  dShape.lineTo(0.112, -0.13);
  dShape.absellipse(0.112, 0, 0.146, 0.13, -Math.PI / 2, Math.PI / 2, false, 0);
  dShape.lineTo(0.004, 0.13);
  dShape.lineTo(0.004, 0.108);
  dShape.quadraticCurveTo(0.038, 0.108, 0.038, 0.084);
  dShape.lineTo(0.038, -0.084);
  dShape.quadraticCurveTo(0.038, -0.108, 0.004, -0.108);
  dShape.closePath();

  const dHole = new Path();
  dHole.moveTo(0.094, -0.1);
  dHole.lineTo(0.094, 0.1);
  dHole.lineTo(0.106, 0.1);
  dHole.absellipse(0.106, 0, 0.092, 0.1, Math.PI / 2, -Math.PI / 2, true, 0);
  dHole.closePath();
  dShape.holes.push(dHole);

  const rawGeom = new ShapeGeometry([rShape, dShape], 64);
  rawGeom.rotateY(Math.PI);

  const nonIndexed = rawGeom.index ? rawGeom.toNonIndexed() : rawGeom;
  const pPos = nonIndexed.attributes.position;
  const pUv = nonIndexed.attributes.uv;
  const keptPos = [];
  const keptNorm = [];
  const keptUv = [];
  const v0 = new Vector3();
  const v1 = new Vector3();
  const v2 = new Vector3();
  const e1 = new Vector3();
  const e2 = new Vector3();

  for (let i = 0; i < pPos.count; i += 3) {
    v0.fromBufferAttribute(pPos, i);
    v1.fromBufferAttribute(pPos, i + 1);
    v2.fromBufferAttribute(pPos, i + 2);
    e1.subVectors(v1, v0);
    e2.subVectors(v2, v0);
    if (e1.cross(e2).lengthSq() <= 1e-18) {
      continue;
    }

    for (let k = 0; k < 3; k += 1) {
      const idx = i + k;
      keptPos.push(pPos.getX(idx), pPos.getY(idx), pPos.getZ(idx));
      keptNorm.push(0, 0, -1);
      if (pUv) {
        keptUv.push(pUv.getX(idx), pUv.getY(idx));
      } else {
        keptUv.push(0, 0);
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(keptPos, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(keptNorm, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(keptUv, 2));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function buildPhone() {
  const root = new Group();
  root.name = "AndroidPhone";

  const bodyMat = getFrameMetal();
  const backGlassMat = getBackSatin();

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
  const speakerDotRadius = 0.021;
  const speakerDotSpacing = 0.068;
  const leftSpeakerDots = getSpeakerDotCenters(-0.52, 5, speakerDotSpacing);
  const rightSpeakerDots = getSpeakerDotCenters(0.54, 5, speakerDotSpacing);

  body.geometry = cutFrameEndHoles(body.geometry, {
    topMic: { x: -0.38, radius: 0.023 },
    bottomOpenings: [{ x: 0, width: 0.296, height: 0.086 }],
    bottomCircles: [...leftSpeakerDots, ...rightSpeakerDots].map((x) => ({
      x,
      radius: speakerDotRadius,
    })),
  });
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

  add(
    root,
    createBackLogoRDGeometry(),
    new MeshPhysicalMaterial({
      color: new Color(0x484d56),
      metalness: 0.78,
      roughness: 0.19,
      envMapIntensity: 0.75,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    }),
    "BackLogoRD",
    [0, 0, bodyBox.min.z - 0.0028],
  );

  // Front Display Elements
  add(
    root,
    roundedRing(glass, screen),
    getGlossyGlass(finish.glassBezel),
    "GlassBezel",
    [0, screenY, frontZ],
  );

  const earpieceY = glass.height / 2 - 0.0055;
  add(
    root,
    new ShapeGeometry(roundedRectShape(0.26, 0.008, 0.004), 24),
    getShadowVoid(0x040507),
    "FrontEarpieceWell",
    [0, earpieceY, frontZ + 0.0015],
  );
  add(
    root,
    new ShapeGeometry(roundedRectShape(0.24, 0.005, 0.0025), 24),
    new MeshStandardMaterial({
      color: new Color(0x1a1c20),
      metalness: 0.45,
      roughness: 0.55,
      envMapIntensity: 0.25,
    }),
    "FrontEarpieceGrill",
    [0, earpieceY, frontZ + 0.002],
  );

  const punchY = screenY + screen.height / 2 - 0.1;
  const punchOuterRadius = 0.046;
  const screenZ = frontZ + 0.002;
  add(
    root,
    roundedScreen(screen.width, screen.height, screen.radius, {
      x: 0,
      y: punchY,
      radius: punchOuterRadius,
    }),
    getShadowVoid(finish.display),
    "Screen",
    [0, screenY, screenZ],
  );

  addFrontPunchHole(root, 0, punchY, screenZ, punchOuterRadius);

  const islandW = 1.05;
  const islandH = 1.05;
  const gridOffset = 0.245;
  const islandR = islandW * 0.5 - gridOffset;
  const islandEdgeInset = 0.075;
  const islandX = back.width * 0.5 - islandEdgeInset - islandW * 0.5;
  const islandY = back.height * 0.5 - islandEdgeInset - islandH * 0.5;
  const islandBevel = 0.028;
  const barZ = bodyBox.min.z - 0.014;

  const islandBaseGeom = new ExtrudeGeometry(
    roundedRectShape(
      islandW - islandBevel * 2,
      islandH - islandBevel * 2,
      islandR - islandBevel,
    ),
    {
      depth: 0.024,
      bevelEnabled: true,
      bevelThickness: 0.026,
      bevelSize: islandBevel,
      bevelSegments: 16,
      curveSegments: 48,
    },
  );
  islandBaseGeom.center();
  islandBaseGeom.computeVertexNormals();

  add(
    root,
    stripFrontCapTriangles(islandBaseGeom),
    new MeshPhysicalMaterial({
      color: new Color(0x282b32),
      metalness: 0.78,
      roughness: 0.26,
      envMapIntensity: 0.65,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    }),
    "CameraBarFrame",
    [islandX, islandY, barZ],
  );

  const windowFaceZ = barZ - 0.0385;
  const lensRadius = 0.168;
  const plateauInset = islandBevel - 0.001;
  const lensHoles = [
    { x: gridOffset, y: gridOffset, radius: lensRadius },
    { x: gridOffset, y: -gridOffset, radius: lensRadius },
    { x: -gridOffset, y: gridOffset, radius: lensRadius },
  ];
  add(
    root,
    createPlateauWindowGeometry(
      islandW - plateauInset * 2,
      islandH - plateauInset * 2,
      islandR - plateauInset,
      0.004,
      lensHoles,
    ),
    new MeshPhysicalMaterial({
      color: new Color(0x1d1f24),
      metalness: 0.18,
      roughness: 0.44,
      clearcoat: 0.2,
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.28,
    }),
    "CameraLensWindow",
    [islandX, islandY, barZ - 0.0365],
  );

  addLens(root, islandX + gridOffset, islandY + gridOffset, windowFaceZ, lensRadius, {
    name: "LensWide",
    kind: "wide",
  });
  addLens(root, islandX + gridOffset, islandY - gridOffset, windowFaceZ, lensRadius, {
    name: "LensUltrawide",
    kind: "ultrawide",
  });
  addLens(root, islandX - gridOffset, islandY + gridOffset, windowFaceZ, lensRadius, {
    name: "LensTelephoto",
    kind: "telephoto",
  });

  const flashX = islandX - gridOffset;
  const flashY = islandY - gridOffset;

  add(
    root,
    createFlashDiffuserGeometry(0.066),
    new MeshPhysicalMaterial({
      color: new Color(0xffffff),
      vertexColors: true,
      roughness: 0.16,
      metalness: 0.02,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      envMapIntensity: 0.4,
    }),
    "FlashLens",
    [flashX, flashY, windowFaceZ - 0.0005],
  );

  addRealisticSideButton(root, bodyBox.max.x, 0.89, 0.26, "PowerButton");
  addRealisticSideButton(root, bodyBox.max.x, 0.33, 0.57, "VolumeButton");

  const topY = bodyBox.max.y;
  const railX = bodyBox.max.x;

  addUsbCPort(root, 0, bottomY);

  addBottomSpeakerDots(root, -0.52, bottomY, 5, speakerDotSpacing, speakerDotRadius, "SpeakerLeft");
  addBottomSpeakerDots(root, 0.54, bottomY, 5, speakerDotSpacing, speakerDotRadius, "SpeakerRight");

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

  addTopMicPinhole(root, -0.38, topY);

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
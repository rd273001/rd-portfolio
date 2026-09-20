"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  ContactShadows,
  Environment,
  useEnvironment,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { getImageProps } from "next/image";
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  DoubleSide,
  LinearFilter,
  MathUtils,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  SRGBColorSpace,
  setConsoleFunction,
  type Camera,
  type Group,
  type Mesh,
  type Scene,
  type Texture,
  type WebGLRenderer,
} from "three";

import { cn } from "@/lib/cn";
import { yieldUntilQuiet } from "./sceneScheduler";

setConsoleFunction((type, message, ...rest) => {
  const text = [message, ...rest].map(String).join(" ");
  if (
    type === "warn" &&
    (text.includes("Clock: This module has been deprecated") ||
      (text.includes("Program Info Log") && text.includes("X4122")))
  ) {
    return;
  }

  const logger = console[type];
  if (typeof logger === "function") {
    logger(message, ...rest);
  }
});

type MobileShowcaseSceneProps = {
  screenshot: string;
  enableDrag: boolean;
  idleMotion?: boolean;
  playIntro: boolean;
  onContextLost: () => void;
  onReady: () => void;
};

const MODEL_URL = "/models/android-phone.glb?v=aspect-9-19.5";
const HDR_URL = "/hdri/studio_small_08_1k.hdr";
const restPose = { x: 0.12, y: -0.52 };
const frontPose = { x: 0, y: 0 };
const introLeft = { x: 0, y: 0.42 };
const introRight = { x: 0.08, y: -0.58 };
const introDuration = 2.45;
const pitchLimit = { min: -1.78, max: 1.78 };
const phoneScale = 0.78;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function introTarget(elapsed: number) {
  if (elapsed < 0.75) {
    const k = easeInOut(elapsed / 0.75);
    return {
      x: MathUtils.lerp(frontPose.x, introLeft.x, k),
      y: MathUtils.lerp(frontPose.y, introLeft.y, k),
    };
  }

  if (elapsed < 1.7) {
    const k = easeInOut((elapsed - 0.75) / 0.95);
    return {
      x: MathUtils.lerp(introLeft.x, introRight.x, k),
      y: MathUtils.lerp(introLeft.y, introRight.y, k),
    };
  }

  if (elapsed < introDuration) {
    const k = easeInOut((elapsed - 1.7) / 0.75);
    return {
      x: MathUtils.lerp(introRight.x, restPose.x, k),
      y: MathUtils.lerp(introRight.y, restPose.y, k),
    };
  }

  return restPose;
}

async function compileScene(
  gl: WebGLRenderer,
  scene: Scene,
  camera: Camera,
) {
  await yieldUntilQuiet();

  const renderer = gl as WebGLRenderer & {
    compileAsync?: (scene: Scene, camera: Camera) => Promise<unknown>;
  };

  if (typeof renderer.compileAsync === "function") {
    await renderer.compileAsync(scene, camera);
    return;
  }

  renderer.compile(scene, camera);
}

function ContextLifecycle({
  onContextLost,
}: Pick<MobileShowcaseSceneProps, "onContextLost">) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
    };
  }, [gl, onContextLost]);

  return null;
}

function applySatinFrameMetal(mesh: Mesh) {
  const geometry = mesh.geometry;
  if (
    geometry.index &&
    geometry.getAttribute("uv") &&
    geometry.getAttribute("normal") &&
    !geometry.getAttribute("tangent")
  ) {
    geometry.computeTangents();
  }

  const hasTangent = Boolean(geometry.getAttribute("tangent"));

  mesh.material = new MeshPhysicalMaterial({
    color: new Color(0x4a4d52),
    metalness: 0.96,
    roughness: 0.38,
    anisotropy: hasTangent ? 0.78 : 0,
    anisotropyRotation: Math.PI / 2,
    envMapIntensity: 0.72,
    clearcoat: 0.08,
    clearcoatRoughness: 0.7,
    specularIntensity: 0.55,
  });
}

function applySideChromeFrame(mesh: Mesh) {
  const material = new MeshPhysicalMaterial({
    color: new Color(0x4a4d52),
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 1.15,
    clearcoat: 0.28,
    clearcoatRoughness: 0.24,
  });

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      varying float vEndFacing;`,
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <beginnormal_vertex>",
      `#include <beginnormal_vertex>
      vEndFacing = smoothstep(0.32, 0.82, abs(normalize(objectNormal).y));`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      varying float vEndFacing;`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `#include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor, 0.4, vEndFacing);`,
    );
  };

  mesh.material = material;
}

function applyBackGlassFinish(root: Group) {
  root.traverse((child) => {
    if (!("isMesh" in child) || !child.isMesh) {
      return;
    }

    const mesh = child as Mesh;
    const source = mesh.material;
    if (!source || Array.isArray(source)) {
      return;
    }

    if (mesh.name === "BackGlass") {
      mesh.material = new MeshPhysicalMaterial({
        color: new Color(0x1e1e1e),
        metalness: 0.07,
        roughness: 0.62,
        envMapIntensity: 0.2,
        clearcoat: 0.16,
        clearcoatRoughness: 0.68,
        vertexColors: Boolean(mesh.geometry.getAttribute("color")),
        side: DoubleSide,
      });
      return;
    }

    if (mesh.name === "Frame") {
      applySideChromeFrame(mesh);
      return;
    }

    if (mesh.name === "AntennaTop") {
      applySatinFrameMetal(mesh);
      return;
    }

    if (mesh.name === "GlassBezel") {
      const next = source.clone();
      if ("metalness" in next) {
        next.metalness = 0.04;
      }
      if ("roughness" in next) {
        next.roughness = 0.42;
      }
      if ("envMapIntensity" in next) {
        next.envMapIntensity = 0.12;
      }
      next.needsUpdate = true;
      mesh.material = next;
      return;
    }
  });
}

function getScreenshotSrc(screenshot: string) {
  return getImageProps({
    src: screenshot,
    alt: "",
    width: 1080,
    height: 2340,
    quality: 95,
  }).props.src;
}

const SCREEN_MAP_MAX_WIDTH = 720;

async function createScreenMap(image: HTMLImageElement) {
  const scale = Math.min(1, SCREEN_MAP_MAX_WIDTH / Math.max(image.naturalWidth, 1));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) {
    return null;
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "medium";

  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(image, {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: "medium",
    });
    context.drawImage(bitmap, 0, 0);
    bitmap.close();
  } else {
    context.drawImage(image, 0, 0, width, height);
  }

  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  map.flipY = true;
  map.generateMipmaps = false;
  map.minFilter = LinearFilter;
  map.magFilter = LinearFilter;
  map.needsUpdate = true;
  return map;
}

function applyScreenMap(root: Group, map: Texture) {
  root.traverse((child) => {
    if (child.name !== "Screen" || !("isMesh" in child) || !child.isMesh) {
      return;
    }

    const mesh = child as Mesh;
    mesh.visible = true;
    mesh.material = new MeshBasicMaterial({
      map,
      toneMapped: false,
    });
  });
}

function ScreenTexture({
  screenshot,
  root,
  onTextureReady,
}: {
  screenshot: string;
  root: Group;
  onTextureReady: () => void;
}) {
  const src = getScreenshotSrc(screenshot);
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let map: Texture | null = null;
    const image = new window.Image();
    image.decoding = "async";

    const handleLoad = () => {
      void createScreenMap(image)
        .then((nextMap) => {
          if (cancelled || !nextMap) {
            nextMap?.dispose();
            return;
          }

          map?.dispose();
          map = nextMap;
          applyScreenMap(root, map);

          if (!readyRef.current) {
            readyRef.current = true;
            onTextureReady();
          }
        })
        .catch(() => {
          /* Keep the 2D placeholder if the screen map cannot be created. */
        });
    };

    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      handleLoad();
    } else {
      image.addEventListener("load", handleLoad);
    }

    return () => {
      cancelled = true;
      image.removeEventListener("load", handleLoad);
      map?.dispose();
    };
  }, [onTextureReady, root, src]);

  return null;
}

function CompileAfterEnvironment({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera, invalidate } = useThree();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await compileScene(gl, scene, camera);
      await yieldUntilQuiet();
      if (cancelled) {
        return;
      }

      invalidate();
      onReady();
    })();

    return () => {
      cancelled = true;
    };
  }, [camera, gl, invalidate, onReady, scene]);

  return null;
}

function ShowcaseWarmup({
  textureReady,
  onReady,
}: {
  textureReady: boolean;
  onReady: () => void;
}) {
  const { gl, scene, camera } = useThree();
  const [environmentEnabled, setEnvironmentEnabled] = useState(false);

  useEffect(() => {
    if (!textureReady) {
      return;
    }

    let cancelled = false;

    void (async () => {
      await compileScene(gl, scene, camera);
      await yieldUntilQuiet();
      if (!cancelled) {
        setEnvironmentEnabled(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [camera, gl, scene, textureReady]);

  if (!environmentEnabled) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Environment files={HDR_URL} environmentIntensity={0.9} />
      <ContactShadows
        position={[0, -1.98, 0]}
        opacity={0.28}
        scale={7}
        blur={2.8}
        far={3.8}
      />
      <CompileAfterEnvironment onReady={onReady} />
    </Suspense>
  );
}

function GltfPhone({
  screenshot,
  onTextureReady,
}: {
  screenshot: string;
  onTextureReady: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const root = useMemo(() => {
    const cloned = scene.clone(true);
    applyBackGlassFinish(cloned);
    return cloned;
  }, [scene]);

  return (
    <group>
      <primitive object={root} />
      <Suspense fallback={null}>
        <ScreenTexture
          screenshot={screenshot}
          root={root}
          onTextureReady={onTextureReady}
        />
      </Suspense>
    </group>
  );
}

function ProductPhone({
  screenshot,
  enableDrag,
  idleMotion = false,
  playIntro,
  stageRef,
  onGrabbingChange,
  onTextureReady,
}: Pick<
  MobileShowcaseSceneProps,
  "screenshot" | "enableDrag" | "idleMotion" | "playIntro"
> & {
  stageRef: RefObject<HTMLDivElement | null>;
  onGrabbingChange: (grabbing: boolean) => void;
  onTextureReady: () => void;
}) {
  const groupRef = useRef<Group>(null);
  const [textureReady, setTextureReady] = useState(false);
  const handleTextureReady = useCallback(() => {
    setTextureReady(true);
    onTextureReady();
  }, [onTextureReady]);
  const targetRotation = useRef({ ...frontPose });
  const introStarted = useRef(false);
  const intro = useRef({
    active: false,
    elapsed: 0,
  });
  const idle = useRef({
    elapsed: 0,
  });
  const drag = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
  });
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!playIntro || introStarted.current) {
      return;
    }

    introStarted.current = true;
    intro.current.active = true;
    intro.current.elapsed = 0;
    targetRotation.current = { ...frontPose };

    const group = groupRef.current;
    if (group) {
      group.rotation.x = frontPose.x;
      group.rotation.y = frontPose.y;
    }

    invalidate();
  }, [invalidate, playIntro]);

  useEffect(() => {
    if (!textureReady) {
      return;
    }

    invalidate();
  }, [invalidate, textureReady]);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || !enableDrag) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current.active) {
        return;
      }

      const dx = event.clientX - drag.current.lastX;
      const dy = event.clientY - drag.current.lastY;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;

      const yaw = dx * 0.0085;
      const pitch = dy * 0.0085;
      targetRotation.current.y += yaw;
      targetRotation.current.x = MathUtils.clamp(
        targetRotation.current.x + pitch,
        pitchLimit.min,
        pitchLimit.max,
      );
      drag.current.vx = yaw;
      drag.current.vy = pitch;
    };

    const onPointerUp = () => {
      if (!drag.current.active) {
        return;
      }

      drag.current.active = false;
      onGrabbingChange(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || drag.current.active) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      intro.current.active = false;
      drag.current.active = true;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
      drag.current.vx = 0;
      drag.current.vy = 0;
      onGrabbingChange(true);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    };

    const canvas = stage.querySelector("canvas");
    stage.addEventListener("pointerdown", onPointerDown, true);
    canvas?.addEventListener("pointerdown", onPointerDown, true);

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown, true);
      canvas?.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [enableDrag, onGrabbingChange, stageRef]);

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const dt = Math.min(delta, 1 / 30);

    if (intro.current.active && !drag.current.active) {
      intro.current.elapsed += dt;
      const next = introTarget(intro.current.elapsed);
      targetRotation.current.x = next.x;
      targetRotation.current.y = next.y;

      if (intro.current.elapsed >= introDuration) {
        intro.current.active = false;
        targetRotation.current.x = restPose.x;
        targetRotation.current.y = restPose.y;
      }
    } else if (idleMotion && !drag.current.active) {
      idle.current.elapsed += dt;
      targetRotation.current.y =
        restPose.y + Math.sin(idle.current.elapsed * 0.32) * 0.16;
      targetRotation.current.x =
        restPose.x + Math.sin(idle.current.elapsed * 0.21) * 0.035;
    } else if (!drag.current.active) {
      targetRotation.current.y += drag.current.vx;
      targetRotation.current.x = MathUtils.clamp(
        targetRotation.current.x + drag.current.vy,
        pitchLimit.min,
        pitchLimit.max,
      );
      const decay = Math.pow(0.935, dt * 60);
      drag.current.vx *= decay;
      drag.current.vy *= decay;

      if (Math.abs(drag.current.vx) < 0.00006) {
        drag.current.vx = 0;
      }

      if (Math.abs(drag.current.vy) < 0.00006) {
        drag.current.vy = 0;
      }
    }

    const damping = drag.current.active ? 22 : intro.current.active ? 6 : 8;
    group.rotation.x = MathUtils.damp(
      group.rotation.x,
      targetRotation.current.x,
      damping,
      dt,
    );
    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      targetRotation.current.y,
      damping,
      dt,
    );

    const stillMoving =
      intro.current.active ||
      drag.current.active ||
      idleMotion ||
      Math.abs(drag.current.vx) > 0 ||
      Math.abs(drag.current.vy) > 0 ||
      Math.abs(group.rotation.x - targetRotation.current.x) > 0.0004 ||
      Math.abs(group.rotation.y - targetRotation.current.y) > 0.0004;

    if (stillMoving) {
      invalidate();
    }
  });

  return (
    <group>
      <group
        ref={groupRef}
        rotation={[frontPose.x, frontPose.y, 0]}
        scale={phoneScale}
      >
        <Suspense fallback={null}>
          <GltfPhone
            screenshot={screenshot}
            onTextureReady={handleTextureReady}
          />
        </Suspense>
      </group>
    </group>
  );
}

export function MobileShowcaseScene({
  screenshot,
  enableDrag,
  idleMotion = false,
  playIntro,
  onContextLost,
  onReady,
}: MobileShowcaseSceneProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [grabbing, setGrabbing] = useState(false);
  const [textureReady, setTextureReady] = useState(false);
  const handleTextureReady = useCallback(() => {
    setTextureReady(true);
  }, []);

  return (
    <div
      ref={stageRef}
      className={cn(
        "h-full w-full select-none",
        enableDrag ? "touch-none" : null,
        enableDrag ? (grabbing ? "cursor-grabbing" : "cursor-grab") : null,
      )}
      style={enableDrag ? undefined : { pointerEvents: "none" }}
    >
      <Canvas
        className="h-full w-full"
        style={enableDrag ? undefined : { pointerEvents: "none" }}
        frameloop={playIntro || grabbing || idleMotion ? "always" : "demand"}
        camera={{ position: [0.1, 0.04, 10.2], fov: 26 }}
        dpr={idleMotion ? 1 : [1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: idleMotion ? "default" : "high-performance",
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <hemisphereLight args={["#e4e2de", "#1a1b1e", 0.32]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 4, 4]} intensity={0.5} />
        <directionalLight position={[6, 0.4, 0.2]} intensity={0.24} />
        <directionalLight position={[0.2, 7.2, 4.5]} intensity={0.22} color="#f5f3ef" />
        <directionalLight position={[0.35, 3.2, -6]} intensity={0.16} color="#f2f2f4" />

        <ContextLifecycle onContextLost={onContextLost} />
        <ProductPhone
          screenshot={screenshot}
          enableDrag={enableDrag}
          idleMotion={idleMotion}
          playIntro={playIntro}
          stageRef={stageRef}
          onGrabbingChange={setGrabbing}
          onTextureReady={handleTextureReady}
        />
        <ShowcaseWarmup textureReady={textureReady} onReady={onReady} />
      </Canvas>
    </div>
  );
}

export function preloadShowcaseAssets() {
  useGLTF.preload(MODEL_URL);
  useEnvironment.preload({ files: HDR_URL });
}
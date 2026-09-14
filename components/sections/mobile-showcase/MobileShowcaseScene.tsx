"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  type RefObject,
} from "react";
import {
  ContactShadows,
  Environment,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ACESFilmicToneMapping,
  MathUtils,
  MeshBasicMaterial,
  type Group,
  type Mesh,
} from "three";

import { cn } from "@/lib/cn";

type MobileShowcaseSceneProps = {
  screenshot: string;
  enableDrag: boolean;
  onContextLost: () => void;
};

const MODEL_URL = "/models/android-phone.glb";
const restPose = { x: 0.16, y: -0.58 };
const pitchLimit = { min: -1.78, max: 1.78 };

function ContextLifecycle({
  onContextLost,
}: Pick<MobileShowcaseSceneProps, "onContextLost">) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    let mounted = true;
    const handleContextLost = (event: Event) => {
      event.preventDefault();

      if (mounted) {
        onContextLost();
      }
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    return () => {
      mounted = false;
      canvas.removeEventListener("webglcontextlost", handleContextLost);
    };
  }, [gl, onContextLost]);

  return null;
}

function GltfPhone({ screenshot }: { screenshot: string }) {
  const { scene } = useGLTF(MODEL_URL);
  const texture = useTexture(screenshot);
  const root = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    root.traverse((child) => {
      if (child.name !== "Screen" || !("isMesh" in child) || !child.isMesh) {
        return;
      }

      (child as Mesh).material = new MeshBasicMaterial({
        map: texture,
        toneMapped: false,
      });
    });
  }, [root, texture]);

  return <primitive object={root} />;
}

function ProductPhone({
  screenshot,
  enableDrag,
  stageRef,
  onGrabbingChange,
}: Pick<MobileShowcaseSceneProps, "screenshot" | "enableDrag"> & {
  stageRef: RefObject<HTMLDivElement | null>;
  onGrabbingChange: (grabbing: boolean) => void;
}) {
  const groupRef = useRef<Group>(null);
  const targetRotation = useRef({ ...restPose });
  const drag = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
  });

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

    if (!drag.current.active) {
      targetRotation.current.y += drag.current.vx;
      targetRotation.current.x = MathUtils.clamp(
        targetRotation.current.x + drag.current.vy,
        pitchLimit.min,
        pitchLimit.max,
      );
      const decay = Math.pow(0.935, delta * 60);
      drag.current.vx *= decay;
      drag.current.vy *= decay;

      if (Math.abs(drag.current.vx) < 0.00006) {
        drag.current.vx = 0;
      }

      if (Math.abs(drag.current.vy) < 0.00006) {
        drag.current.vy = 0;
      }
    }

    const damping = drag.current.active ? 22 : 8;
    group.rotation.x = MathUtils.damp(
      group.rotation.x,
      targetRotation.current.x,
      damping,
      delta,
    );
    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      targetRotation.current.y,
      damping,
      delta,
    );
  });

  return (
    <group>
      <group
        ref={groupRef}
        rotation={[restPose.x, restPose.y, 0]}
        scale={0.8}
      >
        <Suspense fallback={null}>
          <GltfPhone screenshot={screenshot} />
        </Suspense>
      </group>
      <ContactShadows
        position={[0, -1.95, 0]}
        opacity={0.38}
        scale={7}
        blur={2.6}
        far={3.8}
      />
    </group>
  );
}

export function MobileShowcaseScene({
  screenshot,
  enableDrag,
  onContextLost,
}: MobileShowcaseSceneProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [grabbing, setGrabbing] = useState(false);

  return (
    <div
      ref={stageRef}
      className={cn(
        "h-full w-full select-none touch-none",
        grabbing ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0.12, 0.04, 10.4], fov: 26 }}
        dpr={[1, 2]}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        performance={{ min: 0.6 }}
      >
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.12} />
        <directionalLight position={[4.8, 6.2, 7.5]} intensity={0.55} />
        <Environment
          files="/hdri/studio_small_08_1k.hdr"
          environmentIntensity={1.25}
        />
        <ContextLifecycle onContextLost={onContextLost} />
        <ProductPhone
          screenshot={screenshot}
          enableDrag={enableDrag}
          stageRef={stageRef}
          onGrabbingChange={setGrabbing}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);

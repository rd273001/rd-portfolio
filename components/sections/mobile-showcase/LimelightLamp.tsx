"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  LatheGeometry,
  Object3D,
  ShaderMaterial,
  Vector2,
} from "three";

const LAMP_POSITION: [number, number, number] = [0.06, 2.34, -0.68];

const WASH_VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const WASH_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    // vUv.y = 1.0 at top (lamp rim), 0.0 at bottom
    float down = 1.0 - vUv.y;
    float halfWidth = mix(0.032, 0.44, pow(down, 0.88));
    float dist = abs(vUv.x - 0.5) / halfWidth;
    float radial = exp(-dist * dist * 2.1) * smoothstep(1.15, 0.35, dist);

    float verticalFade = smoothstep(0.0, 0.78, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
    float alpha = radial * verticalFade * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function LimelightLamp() {
  const invalidate = useThree((state) => state.invalidate);

  const spotlightTarget = useMemo(() => {
    const target = new Object3D();
    target.position.set(0.04, -0.45, -0.55);
    return target;
  }, []);

  const { outerShadeGeom, innerReflectorGeom, washMaterial } = useMemo(() => {
    const outerPoints = [
      new Vector2(0.036, 0.03),
      new Vector2(0.044, 0.022),
      new Vector2(0.085, 0.002),
      new Vector2(0.142, -0.028),
      new Vector2(0.165, -0.046),
      new Vector2(0.168, -0.052),
      new Vector2(0.16, -0.054),
    ];
    const outer = new LatheGeometry(outerPoints, 48);

    const innerPoints = [
      new Vector2(0.159, -0.052),
      new Vector2(0.136, -0.028),
      new Vector2(0.08, 0.0),
      new Vector2(0.034, 0.02),
      new Vector2(0.001, 0.02),
    ];
    const inner = new LatheGeometry(innerPoints, 48);

    const wash = new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color("#fff1d8") },
        uOpacity: { value: 0.065 },
      },
      vertexShader: WASH_VERTEX_SHADER,
      fragmentShader: WASH_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    return {
      outerShadeGeom: outer,
      innerReflectorGeom: inner,
      washMaterial: wash,
    };
  }, []);

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useEffect(() => {
    return () => {
      outerShadeGeom.dispose();
      innerReflectorGeom.dispose();
      washMaterial.dispose();
    };
  }, [innerReflectorGeom, outerShadeGeom, washMaterial]);

  return (
    <group>
      <primitive object={spotlightTarget} />

      {/* Backdrop atmospheric limelight wash behind the phone's full rotation sphere */}
      <mesh position={[0.055, 0.06, -2.15]} material={washMaterial}>
        <planeGeometry args={[5.2, 5.08]} />
      </mesh>

      <group position={LAMP_POSITION}>
        {/* Braided cord anchored all the way up to the top stage border */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.72, 12]} />
          <meshStandardMaterial
            color="#262930"
            metalness={0.25}
            roughness={0.78}
          />
        </mesh>

        {/* Strain-relief sleeve */}
        <mesh position={[0, 0.072, 0]}>
          <cylinderGeometry args={[0.015, 0.019, 0.032, 24]} />
          <meshStandardMaterial
            color="#202329"
            metalness={0.6}
            roughness={0.45}
          />
        </mesh>

        {/* Machined titanium socket neck */}
        <mesh position={[0, 0.044, 0]}>
          <cylinderGeometry args={[0.034, 0.044, 0.042, 32]} />
          <meshStandardMaterial
            color="#2b2e35"
            metalness={0.88}
            roughness={0.28}
          />
        </mesh>

        {/* Subtle warm brushed-brass accent collar */}
        <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.041, 0.0042, 12, 36]} />
          <meshStandardMaterial
            color="#a8906a"
            metalness={0.9}
            roughness={0.24}
          />
        </mesh>

        {/* Matte charcoal pendant outer shade */}
        <mesh geometry={outerShadeGeom}>
          <meshPhysicalMaterial
            color="#15171b"
            metalness={0.72}
            roughness={0.34}
            clearcoat={0.25}
            clearcoatRoughness={0.32}
            side={DoubleSide}
          />
        </mesh>

        {/* Warm satin reflector interior */}
        <mesh geometry={innerReflectorGeom}>
          <meshStandardMaterial
            color="#e6d3b5"
            emissive="#ffdfb3"
            emissiveIntensity={0.22}
            metalness={0.28}
            roughness={0.42}
            side={DoubleSide}
          />
        </mesh>

        {/* Warm frosted emitter core */}
        <mesh position={[0, -0.012, 0]}>
          <sphereGeometry args={[0.033, 24, 16]} />
          <meshBasicMaterial color="#fff3dc" toneMapped={false} />
        </mesh>

        {/* Local fill for the shade interior */}
        <pointLight
          position={[0, -0.032, 0]}
          color="#ffe8c2"
          intensity={0.42}
          distance={0.9}
          decay={2}
        />

        {/* Ultra-wide diffused overhead backlight (no circular cone cutoff on glass) */}
        <spotLight
          position={[0, -0.02, 0]}
          target={spotlightTarget}
          color="#fff2dc"
          intensity={3.6}
          distance={10}
          angle={1.15}
          penumbra={1}
          decay={1.4}
        />
      </group>
    </group>
  );
}
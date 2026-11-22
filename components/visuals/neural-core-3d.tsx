"use client";

/**
 * Interactive 3D "neural core" for A-VITAL PRO (React Three Fiber).
 * Loaded with next/dynamic (ssr: false) only when the project panel nears the
 * viewport, on capable devices, and never for reduced-motion users.
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Core({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  const { points, lines, shell } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.35, 3);
    const pos = ico.getAttribute("position");
    const seen = new Map<string, THREE.Vector3>();
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      seen.set(`${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`, v);
    }
    const verts = Array.from(seen.values());
    const pGeom = new THREE.BufferGeometry().setFromPoints(verts);
    const colors = new Float32Array(verts.length * 3);
    const c1 = new THREE.Color("#8B7AFF");
    const c2 = new THREE.Color("#32D6E5");
    verts.forEach((v, i) => {
      const c = c1.clone().lerp(c2, (v.y + 1.35) / 2.7);
      colors.set([c.r, c.g, c.b], i * 3);
    });
    pGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const wire = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.35, 2));
    const shellGeom = new THREE.IcosahedronGeometry(0.62, 1);
    ico.dispose();
    return { points: pGeom, lines: wire, shell: shellGeom };
  }, []);

  const t = useRef(0);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    t.current += delta;
    g.rotation.y += delta * 0.18;
    const p = pointer.current ?? { x: 0, y: 0 };
    g.rotation.x += (p.y * 0.35 - g.rotation.x) * 0.05;
    g.rotation.z += (-p.x * 0.2 - g.rotation.z) * 0.05;
    if (inner.current) {
      const s = 1 + Math.sin(t.current * 2.2) * 0.06;
      inner.current.scale.setScalar(s);
      inner.current.rotation.y -= delta * 0.6;
    }
  });

  return (
    <group ref={group}>
      <points geometry={points}>
        <pointsMaterial size={0.045} vertexColors transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#628AFF" transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <mesh ref={inner} geometry={shell}>
        <meshBasicMaterial color="#8B7AFF" wireframe transparent opacity={0.55} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshBasicMaterial color="#C9C2FF" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export default function NeuralCore3D({ active = true }: { active?: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <div
      className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
      }}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        aria-hidden
      >
        <Core pointer={pointer} />
      </Canvas>
    </div>
  );
}

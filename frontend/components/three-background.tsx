'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    THREE?: any;
  }
}

const THREE_CDN = 'https://unpkg.com/three@0.164.1/build/three.min.js';

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!containerRef.current) return;
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (prefersReducedMotion) return;

    const THREE = window.THREE;
    if (!THREE) return;

    const container = containerRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b1220, 4, 16);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const lightA = new THREE.PointLight(0x60a5fa, 1.2, 50);
    lightA.position.set(6, 4, 8);
    scene.add(lightA);

    const lightB = new THREE.PointLight(0x34d399, 0.9, 50);
    lightB.position.set(-6, -3, 6);
    scene.add(lightB);

    const group = new THREE.Group();
    scene.add(group);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.65, 0.55, 180, 18),
      new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.4,
        metalness: 0.15,
        transparent: true,
        opacity: 0.18,
        wireframe: true,
      })
    );
    group.add(knot);

    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.6, 1),
      new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.6,
        metalness: 0.05,
        transparent: true,
        opacity: 0.08,
        wireframe: true,
      })
    );
    group.add(ico);

    const planeGeo = new THREE.PlaneGeometry(20, 20, 1, 1);
    const planeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uA: { value: new THREE.Color(0x0b1220) },
        uB: { value: new THREE.Color(0x0f1f3d) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uA;
        uniform vec3 uB;

        float pat(vec2 p) {
          float a = sin((p.x + uTime * 0.06) * 10.0) * sin((p.y - uTime * 0.05) * 10.0);
          float b = sin((p.x + p.y + uTime * 0.03) * 20.0);
          return 0.5 + 0.5 * (a * 0.55 + b * 0.45);
        }

        void main() {
          vec2 p = vUv * 1.4;
          float n = pat(p);
          float vignette = smoothstep(0.95, 0.25, distance(vUv, vec2(0.5)));
          vec3 col = mix(uA, uB, n);
          col *= 0.6 + 0.4 * vignette;
          gl_FragColor = vec4(col, 0.55);
        }
      `,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.set(0, 0, -8);
    scene.add(plane);

    const clock = new THREE.Clock();

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize, { passive: true });

    const animate = () => {
      const t = clock.getElapsedTime();
      planeMat.uniforms.uTime.value = t;

      group.rotation.y = t * 0.12;
      group.rotation.x = Math.sin(t * 0.25) * 0.08;
      knot.rotation.z = t * 0.08;
      ico.rotation.z = -t * 0.04;

      renderer.render(scene, camera);
      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    cleanupRef.current = () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);

      scene.traverse((obj: any) => {
        if (obj?.geometry?.dispose) obj.geometry.dispose();
        if (obj?.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m?.dispose?.());
          else obj.material?.dispose?.();
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };

    return () => cleanupRef.current?.();
  }, [ready]);

  return (
    <>
      <Script src={THREE_CDN} strategy="afterInteractive" onLoad={() => setReady(true)} />
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
      />
    </>
  );
}


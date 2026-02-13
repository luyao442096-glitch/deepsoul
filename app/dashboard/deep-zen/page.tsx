'use client';

import { useState, useRef, Suspense, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import Link from 'next/link';

function WoodenFish({ onStrike }: { onStrike: (e: React.MouseEvent) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const malletRef = useRef<THREE.Mesh | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const { scene } = useGLTF('/models/wooden-fish.glb');

  useLayoutEffect(() => {
    if (!scene || !groupRef.current) return;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        mesh.geometry.computeBoundingSphere();
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 4;
    const scaleFactor = targetSize / maxDim;

    groupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        meshes.push(mesh);
      }
    });

    if (meshes.length >= 2) {
      meshes.sort((a, b) => {
        const radiusA = a.geometry.boundingSphere?.radius || 0;
        const radiusB = b.geometry.boundingSphere?.radius || 0;
        return radiusA - radiusB;
      });

      malletRef.current = meshes[0];
    }
  }, [scene]);

  const triggerStrike = (e: React.MouseEvent) => {
    if (isAnimating || !malletRef.current) return;
    
    setIsAnimating(true);
    onStrike(e);

    const mallet = malletRef.current;
    const initialRotation = mallet.rotation.clone();

    gsap.to(mallet.rotation, {
      x: initialRotation.x - 0.8,
      duration: 0.1,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(mallet.rotation, {
          x: initialRotation.x,
          duration: 0.1,
          ease: 'power2.out',
          onComplete: () => {
            setIsAnimating(false);
          }
        });
      }
    });
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={scene.clone()} />
      <Html>
        <div 
          className="fixed inset-0 cursor-pointer z-10"
          onClick={triggerStrike}
        />
      </Html>
    </group>
  );
}

function LoadingScreen() {
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-2xl font-serif text-amber-900">Loading 3D Assets...</h2>
        <p className="text-amber-800/70">This may take a moment for large models</p>
      </div>
    </Html>
  );
}

function MeritText({ position }: { position: { x: number; y: number } }) {
  return (
    <div 
      className="fixed pointer-events-none z-20"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        animation: 'fadeUp 1s ease-out forwards'
      }}
    >
      <div className="text-2xl font-serif text-amber-400 drop-shadow-lg">
        +1
      </div>
    </div>
  );
}

export default function DeepZenPage() {
  const [count, setCount] = useState(0);
  const [merits, setMerits] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const playSound = () => {
    const audio = new Audio('/sounds/wood-tap.wav');
    audio.volume = 0.8;
    audio.play();
  };

  const handleStrike = (e: React.MouseEvent) => {
    setCount(prev => prev + 1);
    playSound();

    const newMerit = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };

    setMerits(prev => [...prev, newMerit]);

    setTimeout(() => {
      setMerits(prev => prev.filter(merit => merit.id !== newMerit.id));
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Breadcrumb Navigation */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/50 text-sm font-serif">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-white">Deep Zen</span>
      </div>
      <div className="absolute inset-0">
        <img 
          src="/bg-zen.jpg" 
          alt="Zen Room Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-amber-900/10" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full h-full max-w-5xl max-h-[80vh] relative">
          <Canvas shadows camera={{ position: [0, 1, 8], fov: 45 }}>
            <Suspense fallback={<LoadingScreen />}>
              <Environment preset="sunset" />
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
              <WoodenFish onStrike={handleStrike} />
            </Suspense>
          </Canvas>
        </div>

        {merits.map(merit => (
          <MeritText key={merit.id} position={merit} />
        ))}

        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-2xl font-serif text-amber-900 mb-4">
            Mindful Taps: {count}
          </div>
          <div className="text-lg font-serif text-amber-800/70 max-w-md">
            "The world is noisy. You are safe here."
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-50px);
          }
        }
      `}</style>
    </div>
  );
}
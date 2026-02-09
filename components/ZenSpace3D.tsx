'use client';

import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, useGLTF, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { Howl } from 'howler';
import * as THREE from 'three';
import gsap from 'gsap';

type Mode = 'wooden-fish' | 'prayer-beads';

function WoodenFishModel({ onClick, isMuted }: { onClick: () => void; isMuted: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const fishRef = useRef<THREE.Mesh>(null);
  const malletRef = useRef<THREE.Mesh>(null);
  const soundRef = useRef<Howl | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/sounds/wooden-fish.mp3'],
      volume: 0.8,
      preload: true,
    });
  }, []);

  const { scene } = useGLTF('/models/wooden-fish.glb');

  useEffect(() => {
    if (!groupRef.current) return;

    scene.traverse((object: any) => {
      if (object.isMesh) {
        console.log('Found mesh:', object.name, 'Scale:', object.scale.x);
        
        if (object.scale.x < 0.5) {
          malletRef.current = object as THREE.Mesh;
          console.log('Identified as Mallet (smaller scale)');
        } else {
          fishRef.current = object as THREE.Mesh;
          console.log('Identified as Fish (larger scale)');
        }
      }
    });
  }, [scene]);

  const handleClick = () => {
    if (isAnimating || isMuted || !soundRef.current || !malletRef.current) return;
    
    setIsAnimating(true);
    soundRef.current?.play();
    onClick();

    const mallet = malletRef.current;
    const initialRotation = mallet.rotation.clone();

    gsap.to(mallet.rotation, {
      x: initialRotation.x + 0.8,
      duration: 0.1,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(mallet.rotation, {
          x: initialRotation.x,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            setIsAnimating(false);
          }
        });
      }
    });
  };

  return (
    <group position={[0, -2, 0]} onClick={handleClick}>
      <primitive object={scene.clone()} ref={groupRef} scale={50} rotation={[0.2, -0.5, 0]} />
    </group>
  );
}

function PrayerBeadsModel({ onScroll, isMuted }: { onScroll: () => void; isMuted: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const lastRotationRef = useRef(0);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/sounds/bead-click.mp3'],
      volume: 0.6,
      preload: true,
    });
  }, []);

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (event: any) => {
    if (!isDragging || !groupRef.current) return;
    
    const deltaY = event.movementY;
    const newRotation = rotation + deltaY * 0.01;
    setRotation(newRotation);

    if (Math.abs(newRotation - lastRotationRef.current) > 0.1) {
      if (!isMuted && soundRef.current) {
        soundRef.current.play();
      }
      onScroll();
      
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      
      lastRotationRef.current = newRotation;
    }
  };

  const { scene } = useGLTF('/models/prayer-beads.glb');

  return (
    <group position={[0, -2, 0]}>
      <primitive 
        object={scene.clone()} 
        ref={groupRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        rotation={[0, rotation, 0]}
        scale={80}
      />
    </group>
  );
}

function LoadingScreen() {
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full"
        />
        <h2 className="text-2xl font-serif text-amber-900">Loading 3D Assets...</h2>
        <p className="text-amber-800/70">This may take a moment for large models</p>
      </div>
    </Html>
  );
}

export default function ZenSpace3D() {
  const [mode, setMode] = useState<Mode>('wooden-fish');
  const [isMuted, setIsMuted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [scrollCount, setScrollCount] = useState(0);

  const handleWoodenFishClick = () => {
    setTapCount(prev => prev + 1);
  };

  const handlePrayerBeadsScroll = () => {
    setScrollCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/bg-zen.jpg" 
          alt="Zen Room Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-amber-900/10" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="absolute top-6 left-6 z-20">
          <button className="p-3 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-all shadow-lg">
            <ArrowLeft className="w-5 h-5 text-amber-900" />
          </button>
        </div>

        <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-all shadow-lg"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-amber-900" /> : <Volume2 className="w-5 h-5 text-amber-900" />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full h-full max-w-5xl max-h-[80vh] relative">
            <Canvas camera={{ position: [0, 5, 10], fov: 45, near: 0.1, far: 1000 }}>
              <Suspense fallback={<LoadingScreen />}>
                <Environment preset="sunset" />
                <ambientLight intensity={1} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                
                {mode === 'wooden-fish' && (
                  <WoodenFishModel onClick={handleWoodenFishClick} isMuted={isMuted} />
                )}
                
                {mode === 'prayer-beads' && (
                  <PrayerBeadsModel onScroll={handlePrayerBeadsScroll} isMuted={isMuted} />
                )}
              </Suspense>
            </Canvas>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-8">
          <button
            onClick={() => setMode('wooden-fish')}
            className={`px-6 py-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
              mode === 'wooden-fish' 
                ? 'bg-amber-100/60 scale-110' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <span className="font-serif text-amber-900">Wooden Fish</span>
          </button>

          <button
            onClick={() => setMode('prayer-beads')}
            className={`px-6 py-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
              mode === 'prayer-beads' 
                ? 'bg-amber-100/60 scale-110' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <span className="font-serif text-amber-900">Prayer Beads</span>
          </button>
        </div>

        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 text-center">
          {mode === 'wooden-fish' && (
            <div className="text-center space-y-2">
              <p className="text-amber-900/60 text-sm font-serif tracking-wider uppercase">Mindful Taps</p>
              <p className="text-amber-900 text-4xl font-serif">{tapCount}</p>
            </div>
          )}
          
          {mode === 'prayer-beads' && (
            <div className="text-center space-y-2">
              <p className="text-amber-900/60 text-sm font-serif tracking-wider uppercase">Mindful Scrolls</p>
              <p className="text-amber-900 text-4xl font-serif">{scrollCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

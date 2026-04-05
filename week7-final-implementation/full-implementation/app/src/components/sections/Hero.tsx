import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import type { Route } from '@/types';

interface HeroProps {
  onNavigate: (route: Route) => void;
}

// 3D Digital Grid Background
function DigitalGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 10;
    }
    if (planeRef.current) {
      const material = planeRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  // Custom shader for energy pulses
  const shaderData = useRef({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color('#2d3a8c') },
      color2: { value: new THREE.Color('#7B61FF') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      
      void main() {
        float pulse = sin(vUv.y * 20.0 + time * 2.0) * 0.5 + 0.5;
        float grid = step(0.98, fract(vUv.x * 50.0)) + step(0.98, fract(vUv.y * 50.0));
        vec3 color = mix(color1, color2, pulse * 0.3);
        gl_FragColor = vec4(color, grid * 0.1 + pulse * 0.05);
      }
    `,
  });

  return (
    <>
      {/* Infinite Grid */}
      <gridHelper
        ref={gridRef}
        args={[100, 100, '#2d3a8c', '#1a1f3d']}
        position={[0, -5, 0]}
      />
      
      {/* Shader Plane */}
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <shaderMaterial
          uniforms={shaderData.current.uniforms}
          vertexShader={shaderData.current.vertexShader}
          fragmentShader={shaderData.current.fragmentShader}
          transparent
        />
      </mesh>
      
      {/* Floating Particles */}
      <ParticleField />
    </>
  );
}

// Particle Field
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const col = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const colorChoice = Math.random();
      if (colorChoice > 0.7) {
        col[i * 3] = 0.48; col[i * 3 + 1] = 0.38; col[i * 3 + 2] = 1;
      } else if (colorChoice > 0.4) {
        col[i * 3] = 0; col[i * 3 + 1] = 0.83; col[i * 3 + 2] = 1;
      } else {
        col[i * 3] = 0.18; col[i * 3 + 1] = 0.23; col[i * 3 + 2] = 0.55;
      }
    }
    return col;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positionAttr = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const y = positionAttr.getY(i);
        positionAttr.setY(i, y + Math.sin(state.clock.elapsedTime + i) * 0.01);
      }
      positionAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Animated Title with character decode effect
function AnimatedTitle({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}

export default function Hero({ onNavigate }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale }}
      >
        <Canvas
          camera={{ position: [0, 5, 15], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#7B61FF" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D4FF" />
          <DigitalGrid />
          <fog attach="fog" args={['#070913', 10, 50]} />
        </Canvas>
      </motion.div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        style={{ y, opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-shield-teal animate-pulse" />
          <span className="text-sm text-white/80">AI-Powered Emergency Response System</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-orbitron text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider"
        >
          <span className="glow-text-purple">
            <AnimatedTitle text="S.H.I.E.L.D" />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="overflow-hidden"
        >
          <p className="font-orbitron text-lg sm:text-xl md:text-2xl text-shield-cyan tracking-[0.3em] mb-6">
            Smart Hazard Identification & Emergency Live Dispatch
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-lg text-white/60 max-w-2xl mx-auto mb-10"
        >
          Real-time public safety incident reporting with AI-assisted classification, 
          geo-location mapping, and intelligent emergency dispatch.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={() => onNavigate('register')}
            className="group relative px-8 py-4 rounded-lg bg-gradient-to-r from-shield-purple to-shield-blue text-white font-semibold flex items-center gap-3 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Enter System</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-shield-cyan to-shield-purple opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            onClick={() => onNavigate('citizen-dashboard')}
            className="group px-8 py-4 rounded-lg border border-white/20 text-white font-semibold flex items-center gap-3 hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            <span>View Demo</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '< 3s', label: 'Response Time' },
            { value: '99.9%', label: 'AI Accuracy' },
            { value: '24/7', label: 'Monitoring' },
            { value: '100K+', label: 'Incidents Handled' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 + index * 0.1 }}
            >
              <p className="font-orbitron text-2xl md:text-3xl text-shield-cyan mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/40 tracking-widest">SCROLL</span>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>

      {/* Corner HUD Elements */}
      <div className="absolute top-24 left-8 w-20 h-20 border-l-2 border-t-2 border-shield-purple/30" />
      <div className="absolute top-24 right-8 w-20 h-20 border-r-2 border-t-2 border-shield-purple/30" />
      <div className="absolute bottom-24 left-8 w-20 h-20 border-l-2 border-b-2 border-shield-purple/30" />
      <div className="absolute bottom-24 right-8 w-20 h-20 border-r-2 border-b-2 border-shield-purple/30" />

      {/* Floating Data Points */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block"
          style={{
            top: `${20 + i * 15}%`,
            left: i % 2 === 0 ? '5%' : 'auto',
            right: i % 2 === 1 ? '5%' : 'auto',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          <div className="flex items-center gap-2 text-xs font-mono text-shield-purple/50">
            <div className="w-1.5 h-1.5 rounded-full bg-shield-purple/50" />
            <span>SYS_{String(i + 1).padStart(3, '0')}</span>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

import { useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Cpu, Database, Globe, Server, Code2, Layers } from 'lucide-react';

const technologies = [
  { name: 'React', icon: Code2, color: '#61DAFB', description: 'Frontend Framework' },
  { name: 'Node.js', icon: Server, color: '#339933', description: 'Backend Runtime' },
  { name: 'MongoDB', icon: Database, color: '#47A248', description: 'Database' },
  { name: 'TensorFlow', icon: Cpu, color: '#FF6F00', description: 'AI/ML Engine' },
  { name: 'Leaflet', icon: Globe, color: '#199900', description: 'Mapping' },
  { name: 'WebSocket', icon: Layers, color: '#7B61FF', description: 'Real-time Comm' },
];

// 3D Orbiting Tech Icons
function TechOrbit() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  const radius = 3;
  const techCount = technologies.length;

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial
          color="#7B61FF"
          metalness={0.9}
          roughness={0.1}
          emissive="#7B61FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner Glow */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#7B61FF"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Orbital Rings */}
      {[2, 3, 4].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r * 0.8, r * 0.8 + 0.02, 64]} />
          <meshBasicMaterial color="#2d3a8c" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Tech Icons */}
      {technologies.map((tech, index) => {
        const angle = (index / techCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.5;

        return (
          <group key={tech.name} position={[x, y, z]}>
            {/* Connection Line to Center */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, -x, -y, -z]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#2d3a8c" transparent opacity={0.3} />
            </line>

            {/* Tech Sphere */}
            <mesh
              onPointerEnter={() => setHoveredTech(tech.name)}
              onPointerLeave={() => setHoveredTech(null)}
            >
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshPhysicalMaterial
                color={tech.color}
                metalness={0.8}
                roughness={0.2}
                emissive={tech.color}
                emissiveIntensity={hoveredTech === tech.name ? 0.5 : 0.2}
              />
            </mesh>

            {/* Glow Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.4, 0.45, 32]} />
              <meshBasicMaterial color={tech.color} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      {/* Particle Field */}
      <ParticleField />
    </group>
  );
}

// Particle Field for background
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#7B61FF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [activeTech, setActiveTech] = useState<string | null>(null);

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden"
      id="technology"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-shield-dark via-shield-navy/20 to-shield-dark" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <Cpu className="w-4 h-4 text-shield-cyan" />
              <span className="text-sm text-white/80">Technology Stack</span>
            </motion.div>

            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6">
              Powered by{' '}
              <span className="text-gradient">Advanced Technology</span>
            </h2>

            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              Built with cutting-edge technologies for maximum performance, 
              security, and scalability. Our AI-powered engine processes 
              thousands of incidents in real-time.
            </p>

            {/* Tech List */}
            <div className="grid grid-cols-2 gap-4">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onMouseEnter={() => setActiveTech(tech.name)}
                  onMouseLeave={() => setActiveTech(null)}
                  className={`glass-card p-4 cursor-pointer transition-all duration-300 ${
                    activeTech === tech.name ? 'scale-105 border-shield-purple/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${tech.color}20` }}
                    >
                      <tech.icon className="w-5 h-5" style={{ color: tech.color }} />
                    </div>
                    <div>
                      <h4 className="font-orbitron text-sm font-semibold text-white">
                        {tech.name}
                      </h4>
                      <p className="text-xs text-white/50">{tech.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 }}
              className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-shield-purple/20 to-shield-cyan/20 border border-shield-purple/30"
            >
              <div className="w-3 h-3 rounded-full bg-shield-cyan animate-pulse" />
              <span className="font-orbitron text-sm text-white">
                AI-Powered Engine v2.0
              </span>
            </motion.div>
          </motion.div>

          {/* Right - 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            {/* 3D Canvas */}
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#7B61FF" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D4FF" />
              <TechOrbit />
            </Canvas>

            {/* Overlay Stats */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <div className="glass-card px-4 py-2">
                <p className="text-xs text-white/50">Processing</p>
                <p className="font-orbitron text-sm text-shield-cyan">10K+ req/s</p>
              </div>
              <div className="glass-card px-4 py-2">
                <p className="text-xs text-white/50">Uptime</p>
                <p className="font-orbitron text-sm text-shield-teal">99.99%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-shield-cyan/30 to-transparent" />
    </section>
  );
}

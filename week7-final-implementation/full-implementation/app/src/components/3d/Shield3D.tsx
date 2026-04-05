import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShieldMeshProps {
  progress: number;
}

function ShieldMesh({ progress }: ShieldMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Create shield geometry
  const shieldShape = useMemo(() => {
    const shape = new THREE.Shape();
    const width = 2;
    const height = 2.5;
    const radius = 0.3;
    
    // Start from top center
    shape.moveTo(0, height);
    // Top right curve
    shape.quadraticCurveTo(width * 0.5, height, width * 0.5, height - radius);
    // Right side
    shape.lineTo(width * 0.4, height * 0.3);
    // Bottom right curve
    shape.quadraticCurveTo(width * 0.4, 0, width * 0.2, 0);
    // Bottom point
    shape.lineTo(0, -height * 0.3);
    // Bottom left
    shape.lineTo(-width * 0.2, 0);
    // Bottom left curve
    shape.quadraticCurveTo(-width * 0.4, 0, -width * 0.4, height * 0.3);
    // Left side
    shape.lineTo(-width * 0.5, height - radius);
    // Top left curve
    shape.quadraticCurveTo(-width * 0.5, height, 0, height);
    
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    steps: 2,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 5,
  }), []);

  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    geo.center();
    return geo;
  }, [shieldShape, extrudeSettings]);

  const wireframeGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shieldShape, { ...extrudeSettings, bevelEnabled: false });
    geo.center();
    return new THREE.WireframeGeometry(geo);
  }, [shieldShape, extrudeSettings]);

  return (
    <group ref={meshRef}>
      {/* Main shield mesh */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#1a1f3d"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <lineSegments ref={wireframeRef} geometry={wireframeGeometry}>
        <lineBasicMaterial color="#7B61FF" linewidth={2} />
      </lineSegments>
      
      {/* Inner glow ring */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0.15]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshBasicMaterial 
          color="#7B61FF" 
          transparent 
          opacity={0.5 + Math.sin(progress * Math.PI) * 0.3}
        />
      </mesh>
      
      {/* Center emblem */}
      <mesh position={[0, 0, 0.2]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.8} />
      </mesh>
      
      {/* Outer glow effect */}
      <mesh position={[0, 0, -0.2]}>
        <ringGeometry args={[1.2, 1.4, 64]} />
        <meshBasicMaterial 
          color="#7B61FF" 
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Pulsing rings */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} rotation={[0, 0, 0]} position={[0, 0, -0.1 - i * 0.05]}>
          <ringGeometry args={[1.5 + i * 0.2, 1.55 + i * 0.2, 64]} />
          <meshBasicMaterial 
            color="#7B61FF" 
            transparent 
            opacity={0.1 - i * 0.03}
          />
        </mesh>
      ))}
    </group>
  );
}

// Particle field for background
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
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

// Grid floor
function GridFloor() {
  return (
    <gridHelper
      args={[30, 30, '#2d3a8c', '#1a1f3d']}
      position={[0, -5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

interface Shield3DProps {
  progress?: number;
}

export default function Shield3D({ progress = 0 }: Shield3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#7B61FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D4FF" />
        <spotLight
          position={[0, 10, 0]}
          angle={Math.PI / 6}
          penumbra={1}
          intensity={0.8}
          color="#7B61FF"
        />
        
        <ShieldMesh progress={progress} />
        <ParticleField />
        <GridFloor />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#070913', 5, 20]} />
      </Canvas>
    </div>
  );
}

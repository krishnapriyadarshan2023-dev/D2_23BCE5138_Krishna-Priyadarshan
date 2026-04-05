import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Shield3D from './3d/Shield3D';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const fullText = 'INITIALIZING S.H.I.E.L.D SYSTEM...';

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Text typing effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #0a0e27 0%, #070913 100%)' }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      
      {/* Radar Sweep Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] relative">
          <div className="absolute inset-0 radar-sweep opacity-20" 
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(123, 97, 255, 0.3) 60deg, transparent 60deg)',
              borderRadius: '50%'
            }}
          />
          {/* Concentric circles */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-shield-purple/20 rounded-full"
              style={{
                transform: `scale(${0.2 + i * 0.2})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D Shield */}
      <div className="relative w-80 h-80 mb-8">
        <Shield3D progress={progress / 100} />
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center z-10"
      >
        <h2 className="font-orbitron text-xl text-shield-cyan tracking-widest mb-4">
          {text}
          <span className="animate-pulse">_</span>
        </h2>
        
        {/* Progress Bar */}
        <div className="w-80 h-2 bg-shield-navy rounded-full overflow-hidden border border-shield-purple/30">
          <motion.div
            className="h-full bg-gradient-to-r from-shield-purple to-shield-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Progress Percentage */}
        <p className="font-orbitron text-shield-purple mt-3 text-lg">
          {Math.min(Math.round(progress), 100)}%
        </p>
        
        {/* System Status */}
        <div className="mt-6 flex gap-4 justify-center text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-shield-teal animate-pulse" />
            <span className="text-white/60">AI ENGINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-shield-teal animate-pulse" />
            <span className="text-white/60">MAP MODULE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-shield-teal animate-pulse" />
            <span className="text-white/60">ALERT SYSTEM</span>
          </div>
        </div>
      </motion.div>

      {/* Corner HUD Elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-shield-purple/50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-shield-purple/50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-shield-purple/50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-shield-purple/50" />

      {/* Data Stream Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-shield-purple/10 font-mono text-xs"
            style={{
              left: `${i * 10}%`,
              animation: `data-fall ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {Array(20).fill(0).map(() => Math.round(Math.random())).join('')}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

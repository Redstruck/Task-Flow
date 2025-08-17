import React, { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  initialX: number;
  velocityY: number;
  velocityX: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  shape: 'circle' | 'square' | 'triangle';
  startTime: number;
}

interface ConfettiEffectProps {
  isActive: boolean;
  onComplete: () => void;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ isActive, onComplete }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  const colors = [
    '#FFD700', // Gold
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Light Yellow
    '#BB8FCE', // Light Purple
    '#85C1E9', // Light Blue
    '#F8C471', // Orange
    '#FF69B4', // Hot Pink
    '#00CED1', // Dark Turquoise
    '#FFB347', // Peach
    '#FF1493', // Deep Pink
    '#00FF7F', // Spring Green
    '#FF4500'  // Orange Red
  ];

  const createParticle = (id: number, startTime: number): ConfettiParticle => {
    const x = Math.random() * window.innerWidth;
    return {
      id,
      x,
      y: window.innerHeight, // Start from bottom
      initialX: x,
      velocityY: -(Math.random() * 15 + 20), // Strong upward velocity
      velocityX: (Math.random() - 0.5) * 8, // Horizontal spread
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      gravity: 0.5, // Gravity pulls particles down
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
      startTime
    };
  };

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Create initial burst of particles (more particles)
    const startTime = performance.now();
    const initialParticles = Array.from({ length: 120 }, (_, i) => createParticle(i, startTime + i * 50));
    setParticles(initialParticles);

    // Animation loop
    let animationId: number;

    const animate = (currentTime: number) => {
      setParticles(prevParticles => {
        const updatedParticles = prevParticles.map(particle => {
          const deltaTime = 0.016; // 60 FPS
          
          // Update velocities with physics
          const newVelocityY = particle.velocityY + particle.gravity;
          const newVelocityX = particle.velocityX * 0.98; // Air resistance
          
          // Update position
          const newY = particle.y + newVelocityY * deltaTime * 60;
          const newX = particle.x + newVelocityX * deltaTime * 60;
          
          return {
            ...particle,
            y: newY,
            x: newX,
            velocityY: newVelocityY,
            velocityX: newVelocityX,
            rotation: particle.rotation + particle.rotationSpeed * deltaTime * 60
          };
        }).filter(particle => 
          particle.y < window.innerHeight + 100 && 
          particle.x > -50 && 
          particle.x < window.innerWidth + 50
        );

        // Add new particles during the first 1000ms for continuous effect
        if (currentTime < startTime + 1000 && updatedParticles.length < 200) {
          const newParticles = Array.from({ length: 6 }, (_, i) => 
            createParticle(prevParticles.length + i, currentTime)
          );
          return [...updatedParticles, ...newParticles];
        }

        return updatedParticles;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Auto cleanup after 4 seconds (longer for the new effect)
    const cleanup = setTimeout(() => {
      cancelAnimationFrame(animationId);
      setParticles([]);
      onComplete();
    }, 4000);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(cleanup);
    };
  }, [isActive, onComplete]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  const renderShape = (particle: ConfettiParticle) => {
    const baseStyle = {
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      backgroundColor: particle.color,
      transform: `rotate(${particle.rotation}deg)`,
    };

    switch (particle.shape) {
      case 'circle':
        return (
          <div
            key={particle.id}
            className="absolute w-4 h-4 rounded-full pointer-events-none opacity-95"
            style={baseStyle}
          />
        );
      case 'square':
        return (
          <div
            key={particle.id}
            className="absolute w-4 h-4 pointer-events-none opacity-95"
            style={baseStyle}
          />
        );
      case 'triangle':
        return (
          <div
            key={particle.id}
            className="absolute w-0 h-0 pointer-events-none opacity-95"
            style={{
              ...baseStyle,
              backgroundColor: 'transparent',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: `16px solid ${particle.color}`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(renderShape)}
    </div>
  );
};

export default ConfettiEffect;

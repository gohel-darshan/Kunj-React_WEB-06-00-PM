import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const ParticleBackground = ({ particleCount = 80 }) => {
  const canvasRef = useRef(null);
  const { darkMode, themeColors } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Create particles
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          density: Math.random() * 30 + 1,
          speed: {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3
          },
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };
    
    // Helper function to convert hex to rgba
    const hexToRgba = (hex, opacity) => {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      // Return rgba
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        // Use theme colors for particles
        const primaryColor = themeColors?.primary || '#4a90e2';
        const secondaryColor = themeColors?.secondary || '#50c878';
        
        // Alternate between primary and secondary colors
        const particleColor = Math.random() > 0.5 ? primaryColor : secondaryColor;
        
        ctx.fillStyle = hexToRgba(particleColor, particle.opacity);
        
        ctx.fill();
        
        // Update position
        particle.x += particle.speed.x;
        particle.y += particle.speed.y;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speed.x *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speed.y *= -1;
        }
      });
      
      // Connect particles with lines if they're close enough
      connectParticles();
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    // Connect particles with lines
    const connectParticles = () => {
      const maxDistance = 100;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Calculate opacity based on distance
            const opacity = (1 - distance / maxDistance) * 0.15;
            
            // Use theme colors for lines
            const primaryColor = themeColors?.primary || '#4a90e2';
            
            ctx.beginPath();
            ctx.strokeStyle = hexToRgba(primaryColor, opacity);
            
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Initialize
    setCanvasSize();
    createParticles();
    drawParticles();
    
    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      createParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse interaction
    const handleMouseMove = (e) => {
      // Create a "force field" effect around the mouse
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const radius = 100; // Radius of influence
      const strength = 0.05; // Strength of the force
      
      particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < radius) {
          // Calculate force direction (away from mouse)
          const forceDirectionX = -dx / distance;
          const forceDirectionY = -dy / distance;
          
          // Calculate force magnitude
          const force = (radius - distance) / radius * strength;
          
          // Apply force to particle velocity
          particle.speed.x += forceDirectionX * force;
          particle.speed.y += forceDirectionY * force;
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode, particleCount, themeColors]);
  
  return (
    <ParticleCanvas ref={canvasRef} />
  );
};

const ParticleCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`;

export default ParticleBackground;
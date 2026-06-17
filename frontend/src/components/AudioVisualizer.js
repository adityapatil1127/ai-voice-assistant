import React, { useEffect, useRef } from 'react';
import '../styles/AudioVisualizer.css';

function AudioVisualizer({ state }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    let phase = 0;

    const getParams = () => {
      switch (state) {
        case 'listening':
          return {
            lines: 4,
            amplitude: 35,
            speed: 0.15,
            frequency: 0.04,
            color: 'rgba(59, 130, 246, 0.6)'
          };
        case 'speaking':
          return {
            lines: 5,
            amplitude: 45,
            speed: 0.2,
            frequency: 0.03,
            color: 'rgba(168, 85, 247, 0.6)'
          };
        case 'idle':
        default:
          return {
            lines: 2,
            amplitude: 6,
            speed: 0.04,
            frequency: 0.015,
            color: 'rgba(156, 163, 175, 0.3)'
          };
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      phase += getParams().speed;

      const { lines, amplitude, frequency, color } = getParams();

      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = i === 0 ? 3 : 1.5;

        if (state === 'speaking') {
          const hue = (270 + i * 20) % 360;
          ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${0.8 - i * 0.15})`;
        } else if (state === 'listening') {
          const hue = (200 + i * 15) % 360;
          ctx.strokeStyle = `hsla(${hue}, 85%, 60%, ${0.8 - i * 0.15})`;
        } else {
          ctx.strokeStyle = color;
        }

        for (let x = 0; x < width; x++) {
          const envelope = Math.sin((x / width) * Math.PI);
          const offset = i * 0.5;
          const y = (height / 2) + Math.sin(x * frequency + phase + offset) * amplitude * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state]);

  return (
    <div className="audio-visualizer-wrapper">
      <canvas ref={canvasRef} className="visualizer-canvas" />
      <div className={`status-pill ${state}`}>
        <span className="dot"></span>
        <span className="label">
          {state === 'listening' ? 'Listening...' : state === 'speaking' ? 'Speaking...' : 'Ready'}
        </span>
      </div>
    </div>
  );
}

export default AudioVisualizer;

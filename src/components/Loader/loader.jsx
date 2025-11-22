// FourBoxLoader.jsx
// Local file (for reference): file:///mnt/data/cd4fd7f7-5e0b-4569-a6b0-3ee80a2891b6.png

import React from "react";

export default function FourBoxLoader({ size = 80, gap = 18 }) {
  // size = box size in px, gap = space between boxes
  const wrapperStyle = {
    ['--size']: `${size}px`,
    ['--gap']: `${gap}px`,
  };

  return (
    <div className="loader-root" style={wrapperStyle}>
      <div className="wave">
        <div className="box" style={{ ['--i']: 0 }} />
        <div className="box" style={{ ['--i']: 1 }} />
        <div className="box" style={{ ['--i']: 2 }} />
        <div className="box" style={{ ['--i']: 3 }} />
      </div>

      <style>{`
        .loader-root{ display:flex; align-items:center; justify-content:center; }
        .wave{ display:flex; gap:var(--gap); align-items:flex-end; }

        /* Box base */
        .box{
          width:var(--size);
          height:var(--size);
          border-radius:12px;
          position:relative;
          transform:translateY(0);
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
          box-shadow: 0 4px 12px rgba(0,0,0,0.6), 0 0 18px rgba(255,255,255,0.02) inset;
          overflow:visible;
        }

        /* Glow pseudo-layer */
        .box::before{
          content:"";
          position:absolute;
          inset:0;
          border-radius:inherit;
          z-index:0;
          filter: blur(14px) saturate(120%);
          opacity:0.9;
          transform:translateZ(0);
          mix-blend-mode: screen;
          background: linear-gradient(90deg, rgba(0,220,255,0.22), rgba(158,0,255,0.22), rgba(255,120,0,0.22));
          background-size: 300% 300%;
          animation: glowMove 1.6s ease-in-out infinite;
          pointer-events:none;
        }

        /* Inner sheen */
        .box::after{
          content:"";
          position:absolute;
          left:6%; right:6%; top:8%; height:28%;
          border-radius:8px;
          background: linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          z-index:1;
          pointer-events:none;
        }

        /* Wave motion */
        @keyframes floatWave{
          0%{ transform: translateY(0); }
          50%{ transform: translateY(-24px); }
          100%{ transform: translateY(0); }
        }

        /* Glow motion (moves with wave) */
        @keyframes glowMove{
          0%{ background-position: 0% 50%; opacity:0.85; }
          50%{ background-position: 100% 50%; opacity:1; }
          100%{ background-position: 0% 50%; opacity:0.85; }
        }

        /* Each box animates with staggered delay to form a smooth wave */
        .box{
          animation: floatWave 1.6s cubic-bezier(.62,.01,.16,1) infinite;
          animation-delay: calc(var(--i) * 0.18s);
          will-change: transform;
        }

        /* Sync glow speed and delay to box movement so glow "rides" the box */
        .box::before{
          animation-duration: 1.6s;
          animation-delay: calc(var(--i) * 0.18s);
        }

        /* Add a subtle inner border using pseudo element for metallic look */
        .box::marker{ /* no-op placeholder for some browsers */ }

        /* Slight scale at peak for a bouncy feel */
        @keyframes popScale{
          0%{ transform: translateY(0) scale(1); }
          50%{ transform: translateY(-24px) scale(1.04); }
          100%{ transform: translateY(0) scale(1); }
        }

        /* optionally switch to popScale for a different feeling */
        .box.pop{
          animation-name: popScale;
        }

        /* Responsive: smaller on narrow screens */
        @media (max-width:520px){
          .box{ width: calc(var(--size) * 0.72); height: calc(var(--size) * 0.72);} 
        }

      `}</style>
    </div>
  );
}

// Usage:
// import FourBoxLoader from './FourBoxLoader.jsx'
// <FourBoxLoader size={72} gap={16} />

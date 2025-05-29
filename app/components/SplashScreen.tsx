'use client';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
//   const [text, setText] = useState('');
  const fullText = 'GIBCA FURNITURE INDUSTRY';

  useEffect(() => {
  const logo = document.getElementById("logo");
  const wrapper = document.getElementById("logoWrapper");
  const companyNameEl = document.getElementById("companyName");
  const typeEl = document.getElementById("typewriter");
  const headerLogo = document.getElementById("headerLogo");

  setTimeout(() => logo?.classList.add("animate"), 1250);

  setTimeout(() => {
    if (companyNameEl) companyNameEl.classList.add("visible");

    let i = 0;
    const typing = setInterval(() => {
      if (typeEl) typeEl.textContent += fullText[i];
      i++;
      if (i === fullText.length) clearInterval(typing);
    }, 20);
  }, 1300);

  setTimeout(() => {
    if (!wrapper || !headerLogo) return;

    const splashRect = wrapper.getBoundingClientRect();
    const headerRect = headerLogo.getBoundingClientRect();

    const deltaX = headerRect.left - splashRect.left;
    const deltaY = headerRect.top - splashRect.top;
    const scale = headerRect.width / splashRect.width;

    wrapper.animate([
      {
        transform: 'translate(0px, 0px) scale(1)',
        opacity: 1
      },
      {
        transform: `translate(${deltaX}px, ${deltaY}px) scale(${scale})`,
        opacity: 0
      }
    ], {
      duration: 800,
      easing: 'ease-in-out',
      fill: 'forwards'
    });
  }, 2100);

  setTimeout(onFinish, 3000); 
}, []);


  return (
    <div className="splash-screen">
      <div className="logo-wrapper" id="logoWrapper">
        <div className="logo-container" id="logo">
          <div className="g-clip outer"><div className="fill-up"></div></div>
          <div className="g-clip inner"><div className="fill-up"></div></div>
        </div>
        <h1 className="company-name" id="companyName"><span id="typewriter"></span></h1>
      </div>

      <style jsx>{`
        .splash-screen {
          position: fixed;
          z-index: 9999;
          background: #fff;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: none;
          position: relative;
        }

        .logo-container {
          position: relative;
          width: 138px;
          height: 136px;
        }

        .g-clip {
          position: absolute;
          width: 100px;
          height: 100px;
          background-color: black;
          clip-path: polygon(30% 28%, 100% 28%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 38%, 40% 38%, 40% 62%, 72% 62%, 72% 72%, 30% 72%);
          overflow: hidden;
        }

        .fill-up {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 102%;
          height: 0%;
          background-color: #109C5D;
          transition: height .6s ease-in-out;
          transform: translateX(-1%);
        }

        .outer {
          top: 0;
          left: -1000px;
          animation: slideInLeft 1.1s cubic-bezier(0.68, -0.55, 0.5, 1) forwards;
        }

        .inner {
          bottom: 0;
          right: -700px;
          transform: scaleX(-1);
          transform-origin: center;
          animation: slideInRight 1.1s cubic-bezier(0.68, -0.55, 0.5, 1) forwards;
        }

        @keyframes slideInLeft {
          100% { left: 0; }
        }

        @keyframes slideInRight {
          100% { right: 0; }
        }

        .logo-container.animate .fill-up {
          height: 100%;
        }

        .company-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #3d3d3d;
          margin-top: 20px;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid #0F9761;
          width: fit-content;
          opacity: 1;
          visibility: hidden;
          height: 40px;
        }

        .company-name.visible {
          visibility: visible;
        }

       .logo-wrapper.dissolve {
  animation: slideToHeader 1s ease forwards;
}

@keyframes slideToHeader {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50vw + 40px), calc(-50vh + 30px)) scale(0.43); /* adjust scale for match */
    opacity: 0;
  }
}

      `}</style>
    </div>
  );
}

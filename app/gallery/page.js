'use client';
import { useEffect } from 'react';
import Head from 'next/head';
import './GalleryPage.css'; // make sure this path is valid
import Header from '../components/Header'; // adjust if necessary

export default function GalleryPage() {
  useEffect(() => {
    const density = 5;
    const distance = 0;
    const isPaused = false;
    console.log("Gallery component loaded");
    const directions = ['top', 'right', 'bottom', 'left'];
    const images = [...Array(44).keys()].map(i => `https://picsum.photos/id/${106 + i}/900/500`);

    const allGridElements = [];
    let intervalId;

    function preloadImages(srcArray, callback) {
      let loaded = 0;
      srcArray.forEach(src => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          if (loaded === srcArray.length) callback();
        };
        img.src = src;
      });
    }

    function renderWalls() {
      const gridContainer = document.querySelector('.inf-grid-hero-container');
      if (!gridContainer) return;

      gridContainer.style.setProperty('--grid-sz', density);
      gridContainer.style.setProperty('--rev-dis', distance);

      allGridElements.length = 0;

      directions.forEach(direction => {
        const parent = document.querySelector(`.${direction}`);
        if (!parent) return;
        parent.innerHTML = '';
        const total = density * density;
        for (let i = 1; i <= total; i++) {
  const div = document.createElement('div');
  div.classList.add(`${direction.charAt(0)}${i}`);

  // 👇 Add this block for debugging: inject a visible image immediately
  if (i === 1 && direction === 'top') {
    div.style.backgroundImage = "url('https://picsum.photos/id/106/900/500')";
    div.classList.add('loaded');
  }

  parent.appendChild(div);
  allGridElements.push(div);
}

      });

      startImageInterval();
    }

    function startImageInterval() {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        const unloadedElements = allGridElements.filter(el => !el.classList.contains('loaded'));
        if (unloadedElements.length === 0) return;

        const randomElement = unloadedElements[Math.floor(Math.random() * unloadedElements.length)];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        randomElement.style.backgroundImage = `url('${randomImage}')`;
        randomElement.classList.add('loaded');

        randomElement.addEventListener('click', () => {
          document.body.classList.add('has-selectedPane');
          randomElement.classList.add('selected');
          randomElement.parentNode.classList.add('selectedPane');
        });
      }, 200);
    }

    function setupBackButton() {
      const backBtn = document.getElementById('back-btn');
      if (!backBtn) return;
      backBtn.addEventListener('click', () => {
        document.querySelectorAll('.selected, .selectedPane').forEach(el => el.classList.remove('selected', 'selectedPane'));
        document.body.classList.remove('has-selectedPane');
      });
    }

    // Execute when DOM is ready (inside useEffect)
    preloadImages(images, () => {
      renderWalls();
      setupBackButton();
    });
  }, []);

  return (
    <>
      <Header />
      <Head>
        <title>Photo³ Gallery</title>
        <link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Head>

      <div id="back-btn" className="back-button">← Back to Gallery</div>

      <div className="content">
        <h2>Gallery</h2>
        <p>Explore our stunning photo walls generated dynamically.</p>
        <div className="button">Focus</div>
      </div>

      <section className="inf-grid-hero-container">
        <div className="right"></div>
        <div className="bottom"></div>
        <div className="left"></div>
        <div className="top"></div>
      </section>
    </>
  );
}

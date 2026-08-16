// HandModel.jsx — female_hand.glb 3D modeli, sichqoncha harakatiga ergashadi.
// Model draco bilan siqilgan (129KB) — dekoder /draco/ dan yuklanadi.
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const MODEL_URL = process.env.PUBLIC_URL + '/models/female_hand.glb';
const DRACO_URL = process.env.PUBLIC_URL + '/draco/';

// Sichqoncha ta'siri chegaralari (radian)
const YAW   = 0.85;   // chapga-o'ngga
const PITCH = 0.45;   // yuqoriga-pastga
const EASE  = 0.075;  // silliqlash koeffitsienti

// Hajm: kursor qo'lga yaqinlashsa kattalashadi, uzoqlashsa kichrayadi.
// Diapazon kamera masofasiga moslangan — eng katta holatda ham kesilmaydi.
const ZOOM_NEAR = 1.22;
const ZOOM_FAR  = 0.86;

export default function HandModel({ dark }) {
  const mountRef  = useRef(null);
  const ambientRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [pct, setPct] = useState(0);

  // ── Sahna bir marta quriladi ──
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let raf = 0, disposed = false;
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 6.6);    // kattalashish uchun ham joy qoldiradi

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;   // to'qroq teri rangi uchun
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
    mount.appendChild(renderer.domElement);

    // ── Yoritish — sayt palitrasiga mos (zumrad/laym) ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    ambientRef.current = ambient;
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff3e6, 2.2);
    key.position.set(2.5, 3, 4);
    scene.add(key);

    const rimA = new THREE.DirectionalLight(0x10b981, 2.2);   // zumrad
    rimA.position.set(-3.5, 1.2, -2);
    scene.add(rimA);

    const rimB = new THREE.DirectionalLight(0xa3e635, 1.6);   // laym
    rimB.position.set(2.5, -2.5, -2.5);
    scene.add(rimB);

    const fill = new THREE.HemisphereLight(0xd8fff0, 0x0b2a1d, 1.0);
    scene.add(fill);

    // PBR materiallar uchun muhit xaritasi — busiz teri qora chiqadi
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    // ── Model ──
    const pivot = new THREE.Group();
    pivot.position.x = 0.42;   // biroz o'ngga surilgan
    scene.add(pivot);

    let inner = null;      // masshtablanadigan guruh
    let baseScale = 1;     // neytral masshtab (zoom shunga ko'paytiriladi)

    const draco = new DRACOLoader().setDecoderPath(DRACO_URL);
    const loader = new GLTFLoader().setDRACOLoader(draco);

    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;

        // MUHIM: modelni markazga suramiz, MASSHTABNI esa ота-guruhga qo'llaymiz.
        // Aks holda scale model.position ni ham ko'paytirib, uni kadrdan chiqarib yuboradi.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;

        model.position.sub(center);          // model markazi -> (0,0,0)
        inner = new THREE.Group();
        inner.add(model);
        // Kadr balandligi ~4.03 birlik. Neytral 3.06 (76%), eng katta holatda
        // 3.06*1.22 = 3.73 (93%) — kesilmaydi.
        baseScale = 3.06 / maxDim;
        inner.scale.setScalar(baseScale);

        model.traverse(o => {
          if (o.isMesh) {
            o.castShadow = o.receiveShadow = false;
            o.frustumCulled = false;
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach(m => {
              if (!m) return;
              m.envMapIntensity = 0.7;
              // teri rangini biroz to'qlashtiramiz
              if (m.color) m.color.multiplyScalar(0.82);
              m.needsUpdate = true;
            });
          }
        });

        pivot.add(inner);
        setStatus('ready');
      },
      (e) => {
        if (e.total) setPct(Math.round((e.loaded / e.total) * 100));
      },
      (err) => {
        console.error('[HandModel] yuklanmadi:', err);
        if (!disposed) setStatus('error');
      }
    );

    // ── Sichqoncha kuzatuvi ──
    const target  = { x: 0, y: 0, zoom: 1 };
    const current = { x: 0, y: 0, zoom: 1 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;

      // Kursor qo'l markazidan qancha uzoq — shunga qarab hajm
      const r = mount.getBoundingClientRect();
      const dist = Math.hypot(
        e.clientX - (r.left + r.width / 2),
        e.clientY - (r.top + r.height / 2)
      );
      const maxDist = Math.hypot(window.innerWidth, window.innerHeight) * 0.42;
      const near = 1 - Math.min(dist / maxDist, 1);          // 1 = ustida, 0 = uzoqda
      target.zoom = ZOOM_FAR + (ZOOM_NEAR - ZOOM_FAR) * near;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // ── O'lcham ──
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── Animatsiya ──
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      current.zoom += (target.zoom - current.zoom) * EASE;

      if (inner) inner.scale.setScalar(baseScale * current.zoom);

      // Sichqoncha + sekin "nafas olish" harakati
      pivot.rotation.y =  current.x * YAW   + Math.sin(t * 0.35) * 0.10;
      pivot.rotation.x =  current.y * PITCH + Math.sin(t * 0.47) * 0.05;
      pivot.rotation.z = -current.x * 0.12;
      pivot.position.y = Math.sin(t * 0.8) * 0.07;   // x — yuqorida o'rnatilgan

      renderer.render(scene, camera);
    };
    tick();

    // ── Tozalash ──
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      scene.traverse(o => {
        if (o.isMesh) {
          o.geometry?.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(m => {
            if (!m) return;
            Object.values(m).forEach(v => { if (v && v.isTexture) v.dispose(); });
            m.dispose();
          });
        }
      });
      draco.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  // ── Mavzu o'zgarganda yoritishni moslash (sahna qayta qurilmaydi) ──
  useEffect(() => {
    if (ambientRef.current) ambientRef.current.intensity = dark ? 1.5 : 2.4;
  }, [dark]);

  return (
    <div className="hand-stage">
      {/* Orqa fon nuri */}
      <div className="hand-glow" aria-hidden="true"/>

      <div ref={mountRef} className="hand-canvas"
        role="img" aria-label="Imo-ishora qiluvchi 3D qo'l modeli"/>

      {status !== 'ready' && (
        <div className="hand-overlay">
          {status === 'loading' ? (
            <>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="var(--brd2)" strokeWidth="2.5"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span>3D qo'l yuklanmoqda{pct ? ` — ${pct}%` : '...'}</span>
            </>
          ) : (
            <>
              <span style={{ fontSize:44 }}>🖐️</span>
              <span>3D model yuklanmadi</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

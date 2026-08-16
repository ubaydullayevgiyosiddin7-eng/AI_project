// AvatarModel.jsx — MMS Player (DFKI) loyihasidagi AVASAG avatarini ko'rsatadi.
// Video o'ynatilmayotganda "kutish" holatida sekin aylanib turadi.
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const MODEL_URL = process.env.PUBLIC_URL + '/surdo/avatar.glb';
const DRACO_URL = process.env.PUBLIC_URL + '/draco/';

export default function AvatarModel() {
  const mountRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let raf = 0, disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x10b981, 1.4);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const pivot = new THREE.Group();
    scene.add(pivot);

    const draco = new DRACOLoader().setDecoderPath(DRACO_URL);
    const loader = new GLTFLoader().setDRACOLoader(draco);

    loader.load(MODEL_URL, (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;

      // Markazlashtirish -> masshtab ота-guruhda (aks holda kadrdan chiqadi)
      model.position.sub(center);
      const inner = new THREE.Group();
      inner.add(model);
      inner.scale.setScalar(3.0 / maxDim);
      model.traverse(o => { if (o.isMesh) o.frustumCulled = false; });

      pivot.add(inner);
      setStatus('ready');
    }, undefined, (err) => {
      console.error('[AvatarModel] yuklanmadi:', err);
      if (!disposed) setStatus('error');
    });

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

    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      pivot.rotation.y = Math.sin(t * 0.28) * 0.42;   // sekin chayqalish
      pivot.position.y = Math.sin(t * 0.7) * 0.04;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
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
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position:'absolute', inset:0 }}>
      <div ref={mountRef} style={{ width:'100%', height:'100%' }}
        role="img" aria-label="AVASAG 3D avatari"/>
      {status !== 'ready' && (
        <div style={{
          position:'absolute', inset:0, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:10,
          color:'rgba(255,255,255,.72)', fontSize:13, fontWeight:600, pointerEvents:'none',
        }}>
          {status === 'loading' ? (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.25)" strokeWidth="2.5"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Avatar yuklanmoqda...
            </>
          ) : (
            <><span style={{ fontSize:38 }}>🧍</span>Avatar yuklanmadi</>
          )}
        </div>
      )}
    </div>
  );
}

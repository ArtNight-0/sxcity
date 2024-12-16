"use client";

import DashboardLayout from "@/app/components/DashboardLayout";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import Sidebar from "@/app/components/Sidebar";

export default function ThreeDScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0, z: 0 });
  const [cameraFormPosition, setCameraFormPosition] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [targetFormPosition, setTargetFormPosition] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const handleZoomToArea = (position: { x: number; y: number; z: number }) => {
    if (cameraRef.current && controlsRef.current) {
      const duration = 1000;
      const startPosition = cameraRef.current.position.clone();
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);

        cameraRef.current!.position.x =
          startPosition.x + (position.x - startPosition.x) * easeProgress;
        cameraRef.current!.position.y =
          startPosition.y + (position.y - startPosition.y) * easeProgress;
        cameraRef.current!.position.z =
          startPosition.z + (position.z - startPosition.z) * easeProgress;

        controlsRef.current!.target.set(position.x, 0, position.z);
        controlsRef.current!.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  };

  // Tambahkan fungsi handler baru
  const handleCameraPositionChange = (axis: "x" | "y" | "z", value: number) => {
    if (cameraRef.current) {
      cameraRef.current.position[axis] = value;
      setCameraPosition({
        ...cameraPosition,
        [axis]: value,
      });
    }
  };

  const handleTargetPositionChange = (axis: "x" | "y" | "z", value: number) => {
    if (controlsRef.current) {
      controlsRef.current.target[axis] = value;
      controlsRef.current.update();
      setTargetPosition({
        ...targetPosition,
        [axis]: value,
      });
    }
  };

  const handleCameraFormChange = (axis: "x" | "y" | "z", value: number) => {
    setCameraFormPosition({
      ...cameraFormPosition,
      [axis]: value,
    });
  };

  const handleTargetFormChange = (axis: "x" | "y" | "z", value: number) => {
    setTargetFormPosition({
      ...targetFormPosition,
      [axis]: value,
    });
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    // const text = new THREE.TextGeometry("text",23);
    scene.background = new THREE.Color(0x1a1a1a);
    // text.background = new THREE.color

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Tambah controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5; // Batas minimum zoom in
    controls.maxDistance = 500; // Tingkatkan batas maksimum zoom out
    controls.maxPolarAngle = Math.PI / 2; // Batasi rotasi vertikal (opsional)
    controls.target.set(0, 0, 0);

    // Buat loader untuk model 3D
    const loader = new GLTFLoader();

    // Load model dari assets
    loader.load(
      "/assets/3d/map.glb", // Sesuaikan dengan path file 3D Anda
      (gltf) => {
        const model = gltf.scene;

        // Hitung bounding box untuk centering
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Sesuaikan skala jika model terlalu besar/kecil
        model.scale.set(0.5, 0.5, 0.5); // Sesuaikan nilai ini sesuai kebutuhan

        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);

        // Update animasi jika model memiliki animasi
        if (gltf.animations.length) {
          const mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      (progress) => {
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100,
          "%"
        );
      },
      (error) => {
        console.error("Error loading 3D model:", error);
      }
    );

    // Pencahayaan
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Sesuaikan posisi kamera awal
    camera.position.set(-18.65, 60.03, -131.74); // Posisi awal yang sesuai
    controls.target.set(-18.65, 0, -131.74); // Target awal yang sesuai
    controls.update();

    // Setelah set posisi kamera awal, update form values
    setCameraFormPosition({
      x: -18.65,
      y: 60.03,
      z: -131.74,
    });
    setTargetFormPosition({
      x: -18.65,
      y: 0,
      z: -131.74,
    });

    // Animasi
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Update posisi kamera untuk display
      if (camera) {
        setCameraPosition({
          x: Number(camera.position.x.toFixed(2)),
          y: Number(camera.position.y.toFixed(2)),
          z: Number(camera.position.z.toFixed(2)),
        });
        setTargetPosition({
          x: Number(controls.target.x.toFixed(2)),
          y: Number(controls.target.y.toFixed(2)),
          z: Number(controls.target.z.toFixed(2)),
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    setIsLoading(false);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Tambahkan fungsi untuk handle submit perubahan
  const handleSubmitCameraPosition = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(
        cameraFormPosition.x,
        cameraFormPosition.y,
        cameraFormPosition.z
      );
      cameraRef.current.updateProjectionMatrix();
      setCameraPosition(cameraFormPosition); // Update display position
    }
  };

  const handleSubmitTargetPosition = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(
        targetFormPosition.x,
        targetFormPosition.y,
        targetFormPosition.z
      );
      controlsRef.current.update();
      setTargetPosition(targetFormPosition); // Update display position
    }
  };

  // Dalam komponen ThreeDScene, tambahkan konstanta untuk posisi preset
  const CAMERA_POSITIONS = {
    reset: { x: -120, y: 500, z: -100 },
    area1: { x: -8.82, y: 32.73, z: -40.4 },
    area2: { x: -18.65, y: 60.03, z: -131.74 },
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 w-full h-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="text-white">Loading 3D Scene...</div>
            </div>
          )}
          <div
            ref={mountRef}
            className="w-full h-full"
            style={{ height: "calc(100vh - 64px)" }}
          />
        </div>

        <div className="fixed top-0 right-0 h-full w-64 bg-gray-800 overflow-y-auto z-10 transition-all duration-300 transform lg:w-64 md:w-48 sm:w-40">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-100">3D Controls</h2>

            {/* Area Buttons */}
            <div className="space-y-2">
              <button
                className="w-full px-4 py-2 text-gray-100 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                onClick={() => handleZoomToArea(CAMERA_POSITIONS.area1)}
              >
                Area 1
              </button>
              <button
                className="w-full px-4 py-2 text-gray-100 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                onClick={() => handleZoomToArea(CAMERA_POSITIONS.area2)}
              >
                Area 2
              </button>
              <button
                className="w-full px-4 py-2 text-gray-100 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                onClick={() => handleZoomToArea(CAMERA_POSITIONS.reset)}
              >
                Reset View
              </button>
            </div>

            {/* Camera Position Info */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-100 mb-2">
                Camera Position:
              </h3>
              <div className="text-gray-400 text-sm space-y-1">
                <div>X: {cameraPosition.x}</div>
                <div>Y: {cameraPosition.y}</div>
                <div>Z: {cameraPosition.z}</div>
              </div>
            </div>

            {/* Target Position Info */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-100 mb-2">
                Target Position:
              </h3>
              <div className="text-gray-400 text-sm space-y-1">
                <div>X: {targetPosition.x}</div>
                <div>Y: {targetPosition.y}</div>
                <div>Z: {targetPosition.z}</div>
              </div>
            </div>

            {/* Copy Position Button */}
            <button
              className="w-full px-4 py-2 text-gray-100 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              onClick={() => {
                const positionText = `Camera: {x: ${cameraPosition.x}, y: ${cameraPosition.y}, z: ${cameraPosition.z}}\nTarget: {x: ${targetPosition.x}, y: ${targetPosition.y}, z: ${targetPosition.z}}`;
                navigator.clipboard.writeText(positionText);
                alert("Position copied to clipboard!");
              }}
            >
              Copy Position
            </button>

            {/* Manual Position Input */}
            <div>
              <input
                type="text"
                placeholder="X,Y,Z (e.g: 10,5,30)"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const [x, y, z] = e.currentTarget.value
                      .split(",")
                      .map(Number);
                    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                      handleZoomToArea({ x, y, z });
                    }
                  }
                }}
              />
            </div>

            {/* Camera Position Controls */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-100 mb-2">
                Kalibrasi Posisi Kamera:
              </h3>
              <div className="space-y-2">
                {["x", "y", "z"].map((axis) => (
                  <div key={axis} className="flex items-center gap-2">
                    <span className="text-gray-400 w-6 uppercase">{axis}:</span>
                    <input
                      type="number"
                      value={
                        cameraFormPosition[
                          axis as keyof typeof cameraFormPosition
                        ]
                      }
                      onChange={(e) =>
                        handleCameraFormChange(
                          axis as "x" | "y" | "z",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-2 py-1 bg-gray-600 text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      step="0.01"
                    />
                  </div>
                ))}
                <button
                  onClick={handleSubmitCameraPosition}
                  className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Target Position Controls */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-100 mb-2">
                Kalibrasi Posisi Target:
              </h3>
              <div className="space-y-2">
                {["x", "y", "z"].map((axis) => (
                  <div key={axis} className="flex items-center gap-2">
                    <span className="text-gray-400 w-6 uppercase">{axis}:</span>
                    <input
                      type="number"
                      value={
                        targetFormPosition[
                          axis as keyof typeof targetFormPosition
                        ]
                      }
                      onChange={(e) =>
                        handleTargetFormChange(
                          axis as "x" | "y" | "z",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-2 py-1 bg-gray-600 text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      step="0.01"
                    />
                  </div>
                ))}
                <button
                  onClick={handleSubmitTargetPosition}
                  className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

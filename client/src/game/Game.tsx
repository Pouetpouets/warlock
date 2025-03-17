import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Player } from './entities/Player';
import { Arena } from './entities/Arena';
import { ClickIndicator } from './entities/ClickIndicator';
import { TargetCursor } from './entities/TargetCursor';
import * as dat from 'dat.gui';

export const Game: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const arenaRef = useRef<Arena | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const targetPositionRef = useRef<THREE.Vector3 | null>(null);
  const clickIndicatorsRef = useRef<ClickIndicator[]>([]);
  const targetCursorRef = useRef<TargetCursor | null>(null);
  const lastTimeRef = useRef<number>(0);
  const guiRef = useRef<dat.GUI | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 50, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Camera offset from player
    const cameraOffset = new THREE.Vector3(0, 50, 25);

    // Debug panel setup
    const gui = new dat.GUI();
    guiRef.current = gui;

    // Camera controls
    const cameraFolder = gui.addFolder('Camera');
    const cameraParams = {
      height: 50,
      distance: 25,
      fov: 75
    };
    cameraFolder.add(cameraParams, 'height', 10, 100).onChange((value) => {
      cameraOffset.y = value;
    });
    cameraFolder.add(cameraParams, 'distance', 10, 100).onChange((value) => {
      cameraOffset.z = value;
    });
    cameraFolder.add(cameraParams, 'fov', 30, 120).onChange((value) => {
      camera.fov = value;
      camera.updateProjectionMatrix();
    });

    // Player controls
    const playerFolder = gui.addFolder('Player');
    const playerParams = {
      speed: 0.03
    };
    playerFolder.add(playerParams, 'speed', 0.001, 0.1).onChange((value) => {
      if (playerRef.current) {
        playerRef.current.setSpeed(value);
      }
    });

    // Arena controls
    const arenaFolder = gui.addFolder('Arena');
    const arenaParams = {
      size: 100,
      textureRepeat: 4,
      displacementScale: 0.2,
      metalness: 0.1,
      roughness: 0.8,
      envMapIntensity: 1.0,
      lavaColor: '#ff4400',
      lavaEmissiveIntensity: 0.5,
      lavaWidth: 2,
      lavaOpacity: 0.8
    };
    arenaFolder.add(arenaParams, 'size', 20, 200).onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setSize(value);
      }
    });
    arenaFolder.add(arenaParams, 'textureRepeat', 1, 10).onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setTextureRepeat(value);
      }
    });
    arenaFolder.add(arenaParams, 'displacementScale', 0, 1).onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setDisplacementScale(value);
      }
    });
    arenaFolder.add(arenaParams, 'metalness', 0, 1).onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setMetalness(value);
      }
    });
    arenaFolder.add(arenaParams, 'roughness', 0, 1).onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setRoughness(value);
      }
    });
    arenaFolder.add(arenaParams, 'envMapIntensity', 0, 2).onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setEnvMapIntensity(value);
      }
    });
    arenaFolder.addColor(arenaParams, 'lavaColor').onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setLavaColor(parseInt(value.replace('#', ''), 16));
      }
    });
    arenaFolder.add(arenaParams, 'lavaEmissiveIntensity', 0, 2).onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setLavaEmissiveIntensity(value);
      }
    });
    arenaFolder.add(arenaParams, 'lavaWidth', 0.1, 5).onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setLavaWidth(value);
      }
    });
    arenaFolder.add(arenaParams, 'lavaOpacity', 0, 1).onChange((value) => {
      if (arenaRef.current) {
        arenaRef.current.setLavaOpacity(value);
      }
    });

    // Target cursor controls
    const cursorFolder = gui.addFolder('Target Cursor');
    const cursorParams = {
      size: 0.5,
      color: '#00ff00',
      opacity: 0.8
    };
    cursorFolder.add(cursorParams, 'size', 0.1, 2).onChange((value) => {
      if (targetCursorRef.current) {
        targetCursorRef.current.setSize(value);
      }
    });
    cursorFolder.addColor(cursorParams, 'color').onChange((value) => {
      if (targetCursorRef.current) {
        targetCursorRef.current.setColor(parseInt(value.replace('#', ''), 16));
      }
    });
    cursorFolder.add(cursorParams, 'opacity', 0, 1).onChange((value) => {
      if (targetCursorRef.current) {
        targetCursorRef.current.setOpacity(value);
      }
    });

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create arena and player
    const arena = new Arena(scene, arenaParams.size);
    arenaRef.current = arena;
    
    const player = new Player(scene, new THREE.Vector3(0, 0, 0));
    playerRef.current = player;

    // Create target cursor
    const targetCursor = new TargetCursor();
    targetCursorRef.current = targetCursor;
    scene.add(targetCursor.getMesh());

    // Add player to scene
    scene.add(player.getMesh());
    scene.add(player.getDirectionArrow());

    // Mouse controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate intersection with the ground plane
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);

      // Update target cursor position
      if (targetCursorRef.current) {
        targetCursorRef.current.update(intersectionPoint);
      }
    };

    const handleMouseClick = (event: MouseEvent) => {
      if (event.button !== 2) return; // Only handle right click

      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate intersection with the ground plane
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);

      // Set the target position
      targetPositionRef.current = intersectionPoint;

      // Create click indicator
      if (sceneRef.current) {
        const indicator = new ClickIndicator(sceneRef.current, intersectionPoint);
        clickIndicatorsRef.current.push(indicator);
      }
    };

    // Prevent context menu on right click
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseClick);
    window.addEventListener('contextmenu', handleContextMenu);

    // Animation loop
    const animate = (currentTime: number) => {
      requestAnimationFrame(animate);

      // Calculate delta time
      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = currentTime;

      // Update click indicators
      clickIndicatorsRef.current = clickIndicatorsRef.current.filter(indicator => {
        const isActive = indicator.update(deltaTime);
        if (!isActive) {
          indicator.dispose(scene);
        }
        return isActive;
      });

      // Handle movement towards target
      if (playerRef.current && targetPositionRef.current) {
        const currentPos = playerRef.current.getPosition();
        const targetPos = targetPositionRef.current;
        const direction = targetPos.clone().sub(currentPos);

        // If we're close enough to the target, clear it
        if (direction.length() < 0.1) {
          targetPositionRef.current = null;
        } else {
          playerRef.current.move(direction);
        }
      }

      // Update camera position to follow player
      if (playerRef.current && cameraRef.current) {
        const playerPos = playerRef.current.getPosition();
        cameraRef.current.position.copy(playerPos).add(cameraOffset);
        cameraRef.current.lookAt(playerPos);
      }

      renderer.render(scene, camera);
    };
    animate(0);

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseClick);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', handleResize);
      
      // Clean up click indicators
      clickIndicatorsRef.current.forEach(indicator => indicator.dispose(scene));
      clickIndicatorsRef.current = [];
      
      // Clean up target cursor
      if (targetCursorRef.current) {
        targetCursorRef.current.dispose();
      }
      
      // Clean up debug panel
      if (guiRef.current) {
        guiRef.current.destroy();
      }
      
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}; 
import * as THREE from 'three';

export class ClickIndicator {
  private ringMesh: THREE.Mesh;
  private centerMesh: THREE.Mesh;
  private lifetime: number = 1.0; // Duration in seconds
  private currentTime: number = 0;
  private isActive: boolean = true;

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    // Create a ring geometry for the outer indicator
    const ringGeometry = new THREE.RingGeometry(0.5, 1, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    this.ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    this.ringMesh.position.copy(position);
    this.ringMesh.rotation.x = -Math.PI / 2; // Lay flat on the ground
    this.ringMesh.position.y = 0.01; // Slightly above ground to prevent z-fighting
    scene.add(this.ringMesh);

    // Create a center marker
    const centerGeometry = new THREE.CircleGeometry(0.2, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    this.centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
    this.centerMesh.position.copy(position);
    this.centerMesh.rotation.x = -Math.PI / 2;
    this.centerMesh.position.y = 0.01;
    scene.add(this.centerMesh);
  }

  public update(deltaTime: number): boolean {
    if (!this.isActive) return false;

    this.currentTime += deltaTime;
    const progress = this.currentTime / this.lifetime;
    
    // Fade out both meshes
    const ringMaterial = this.ringMesh.material as THREE.MeshStandardMaterial;
    const centerMaterial = this.centerMesh.material as THREE.MeshStandardMaterial;
    const opacity = 0.8 * (1 - progress);
    ringMaterial.opacity = opacity;
    centerMaterial.opacity = opacity;
    
    // Create a pulsing effect for the ring
    const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
    const baseScale = 1 + progress * 2;
    this.ringMesh.scale.set(baseScale * pulseScale, baseScale * pulseScale, baseScale * pulseScale);

    if (progress >= 1) {
      this.isActive = false;
      return false;
    }

    return true;
  }

  public dispose(scene: THREE.Scene) {
    scene.remove(this.ringMesh);
    scene.remove(this.centerMesh);
    this.ringMesh.geometry.dispose();
    this.ringMesh.material.dispose();
    this.centerMesh.geometry.dispose();
    this.centerMesh.material.dispose();
  }
} 
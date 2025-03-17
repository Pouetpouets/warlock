import * as THREE from 'three';

export class Arena {
  private ground: THREE.Mesh;
  private lavaBoundary: THREE.Mesh;
  private size: number = 100; // Changed from 40 to 100

  constructor(scene: THREE.Scene) {
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(this.size, this.size);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.2
    });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.5;
    scene.add(this.ground);

    // Create lava boundary
    const lavaGeometry = new THREE.TorusGeometry(this.size / 2, 0.5, 16, 100);
    const lavaMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff4400,
      emissive: 0xff2200,
      emissiveIntensity: 0.5
    });
    this.lavaBoundary = new THREE.Mesh(lavaGeometry, lavaMaterial);
    this.lavaBoundary.rotation.x = Math.PI / 2;
    scene.add(this.lavaBoundary);
  }

  public shrink(amount: number) {
    this.size -= amount;
    this.ground.geometry.dispose();
    this.ground.geometry = new THREE.PlaneGeometry(this.size, this.size);
    this.ground.geometry.needsUpdate = true;

    this.lavaBoundary.geometry.dispose();
    this.lavaBoundary.geometry = new THREE.TorusGeometry(this.size / 2, 0.5, 16, 100);
    this.lavaBoundary.geometry.needsUpdate = true;
  }

  public getSize(): number {
    return this.size;
  }

  public setSize(size: number) {
    this.size = size;
    this.ground.geometry.dispose();
    this.ground.geometry = new THREE.PlaneGeometry(this.size, this.size);
    this.ground.geometry.needsUpdate = true;

    this.lavaBoundary.geometry.dispose();
    this.lavaBoundary.geometry = new THREE.TorusGeometry(this.size / 2, 0.5, 16, 100);
    this.lavaBoundary.geometry.needsUpdate = true;
  }
} 
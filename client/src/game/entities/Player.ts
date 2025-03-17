import * as THREE from 'three';

export class Player {
  private mesh: THREE.Mesh;
  private speed: number = 0.01;
  private position: THREE.Vector3;
  private direction: THREE.Vector3;

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    // Create a simple character mesh (we'll replace this with a proper model later)
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x800080 }); // Purple color for warlock
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this.mesh.castShadow = true;
    scene.add(this.mesh);

    this.position = position;
    this.direction = new THREE.Vector3();
  }

  public move(direction: THREE.Vector3) {
    // Normalize the direction vector
    this.direction.copy(direction).normalize();
    
    // Move the player
    this.position.add(this.direction.multiplyScalar(this.speed));
    this.mesh.position.copy(this.position);

    // Rotate the player to face the movement direction
    if (this.direction.length() > 0) {
      const angle = Math.atan2(this.direction.x, this.direction.z);
      this.mesh.rotation.y = angle;
    }
  }

  public getPosition(): THREE.Vector3 {
    return this.position;
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }

  public setSpeed(speed: number) {
    this.speed = speed;
  }
} 
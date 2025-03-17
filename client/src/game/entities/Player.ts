import * as THREE from 'three';
import { DirectionArrow } from './DirectionArrow';

export class Player {
  private mesh: THREE.Mesh;
  private speed: number = 0.03;
  private position: THREE.Vector3;
  private direction: THREE.Vector3;
  private directionArrow: DirectionArrow;

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
    this.directionArrow = new DirectionArrow();
  }

  public move(direction: THREE.Vector3) {
    this.direction.copy(direction);
    if (this.direction.length() > 0) {
      this.direction.normalize();
      this.position.add(this.direction.multiplyScalar(this.speed));
      this.mesh.position.copy(this.position);
      
      // Rotate the player to face the movement direction
      const angle = Math.atan2(this.direction.x, this.direction.z);
      this.mesh.rotation.y = angle;

      // Update direction arrow
      this.directionArrow.update(this.direction, this.position);
    } else {
      this.directionArrow.update(new THREE.Vector3(), this.position);
    }
  }

  public getPosition(): THREE.Vector3 {
    return this.position;
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }

  public getDirectionArrow(): THREE.Mesh {
    return this.directionArrow.getMesh();
  }

  public setSpeed(speed: number) {
    this.speed = speed;
  }

  public dispose() {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.directionArrow.dispose();
  }
} 
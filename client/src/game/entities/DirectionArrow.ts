import * as THREE from 'three';

export class DirectionArrow {
    private mesh: THREE.Mesh;
    private direction: THREE.Vector3;
    private visible: boolean;

    constructor() {
        // Create arrow geometry
        const arrowGeometry = new THREE.ConeGeometry(0.3, 1, 8);
        const arrowMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.mesh.rotation.x = -Math.PI / 2; // Point downward
        this.mesh.position.y = 0.1; // Slightly above ground
        this.mesh.visible = false;

        this.direction = new THREE.Vector3();
        this.visible = false;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public update(direction: THREE.Vector3, position: THREE.Vector3) {
        if (direction.length() > 0) {
            this.direction.copy(direction).normalize();
            this.mesh.position.copy(position);
            this.mesh.position.y = 0.1; // Keep slightly above ground
            this.mesh.rotation.z = Math.atan2(this.direction.x, this.direction.z);
            this.mesh.visible = true;
            this.visible = true;
        } else {
            this.mesh.visible = false;
            this.visible = false;
        }
    }

    public dispose() {
        if (this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
} 
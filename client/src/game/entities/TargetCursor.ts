import * as THREE from 'three';

export class TargetCursor {
    private mesh: THREE.Mesh;
    private size: number;
    private color: number;
    private opacity: number;

    constructor() {
        this.size = 0.5;
        this.color = 0x00ff00;
        this.opacity = 0.8;

        // Create target geometry (outer ring)
        const outerRing = new THREE.RingGeometry(this.size * 0.8, this.size, 32);
        const innerRing = new THREE.RingGeometry(this.size * 0.2, this.size * 0.4, 32);
        
        // Create materials
        const material = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: this.opacity,
            side: THREE.DoubleSide
        });

        // Create meshes
        const outerMesh = new THREE.Mesh(outerRing, material);
        const innerMesh = new THREE.Mesh(innerRing, material);
        
        // Create group to hold both rings
        this.mesh = new THREE.Group();
        this.mesh.add(outerMesh);
        this.mesh.add(innerMesh);
        
        // Position slightly above ground
        this.mesh.position.y = 0.1;
    }

    public getMesh(): THREE.Group {
        return this.mesh;
    }

    public update(position: THREE.Vector3) {
        this.mesh.position.copy(position);
        this.mesh.position.y = 0.1; // Keep slightly above ground
    }

    public setSize(size: number) {
        this.size = size;
        const outerRing = this.mesh.children[0].geometry as THREE.RingGeometry;
        const innerRing = this.mesh.children[1].geometry as THREE.RingGeometry;
        
        outerRing.parameters.innerRadius = this.size * 0.8;
        outerRing.parameters.outerRadius = this.size;
        innerRing.parameters.innerRadius = this.size * 0.2;
        innerRing.parameters.outerRadius = this.size * 0.4;
        
        outerRing.updateGeometry();
        innerRing.updateGeometry();
    }

    public setColor(color: number) {
        this.color = color;
        const material = this.mesh.children[0].material as THREE.MeshBasicMaterial;
        material.color.setHex(color);
    }

    public setOpacity(opacity: number) {
        this.opacity = opacity;
        const material = this.mesh.children[0].material as THREE.MeshBasicMaterial;
        material.opacity = opacity;
    }

    public dispose() {
        if (this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
        this.mesh.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }
} 
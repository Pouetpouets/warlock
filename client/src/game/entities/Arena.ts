import * as THREE from 'three';

export class Arena {
  private mesh: THREE.Mesh;
  private size: number;
  private material: THREE.MeshStandardMaterial;
  private textures: {
    diffuse: THREE.Texture;
    normal: THREE.Texture;
    roughness: THREE.Texture;
    displacement: THREE.Texture;
    specular: THREE.Texture;
  };

  constructor(scene: THREE.Scene, size: number = 100) {
    this.size = size;

    // Create ground geometry
    const geometry = new THREE.PlaneGeometry(this.size, this.size);
    geometry.rotateX(-Math.PI / 2);

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    this.textures = {
      diffuse: textureLoader.load('/textures/ground/rocky_terrain.blend/textures/rocky_terrain_02_diff_4k.jpg'),
      normal: textureLoader.load('/textures/ground/rocky_terrain.blend/textures/rocky_terrain_02_nor_gl_4k.exr'),
      roughness: textureLoader.load('/textures/ground/rocky_terrain.blend/textures/rocky_terrain_02_rough_4k.exr'),
      displacement: textureLoader.load('/textures/ground/rocky_terrain.blend/textures/rocky_terrain_02_disp_4k.png'),
      specular: textureLoader.load('/textures/ground/rocky_terrain.blend/textures/rocky_terrain_02_spec_4k.png')
    };

    // Configure textures
    this.setTextureRepeat(4);

    // Create material
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.diffuse,
      normalMap: this.textures.normal,
      roughnessMap: this.textures.roughness,
      displacementMap: this.textures.displacement,
      displacementScale: 0.2,
      metalness: 0.1,
      roughness: 0.8,
      envMapIntensity: 1.0
    });

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.receiveShadow = true;

    // Add to scene
    scene.add(this.mesh);
  }

  public setSize(size: number) {
    this.size = size;
    const geometry = new THREE.PlaneGeometry(this.size, this.size);
    geometry.rotateX(-Math.PI / 2);
    this.mesh.geometry.dispose();
    this.mesh.geometry = geometry;
  }

  public setTextureRepeat(repeat: number) {
    Object.values(this.textures).forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeat, repeat);
    });
  }

  public setDisplacementScale(scale: number) {
    this.material.displacementScale = scale;
  }

  public setMetalness(metalness: number) {
    this.material.metalness = metalness;
  }

  public setRoughness(roughness: number) {
    this.material.roughness = roughness;
  }

  public setEnvMapIntensity(intensity: number) {
    this.material.envMapIntensity = intensity;
  }

  public dispose() {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
    this.mesh.geometry.dispose();
    this.material.dispose();
    Object.values(this.textures).forEach(texture => texture.dispose());
  }
} 
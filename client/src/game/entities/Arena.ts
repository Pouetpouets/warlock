import * as THREE from 'three';

export class Arena {
  private mesh: THREE.Mesh;
  private lavaField: THREE.Mesh;
  private lavaBoundary: THREE.Mesh;
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

    // Create lava field (large plane that covers everything)
    const lavaFieldGeometry = new THREE.PlaneGeometry(this.size * 2, this.size * 2);
    lavaFieldGeometry.rotateX(-Math.PI / 2);
    const lavaFieldMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4400,
      emissive: 0xff2200,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8
    });
    this.lavaField = new THREE.Mesh(lavaFieldGeometry, lavaFieldMaterial);
    this.lavaField.position.y = -0.1; // Slightly below the ground

    // Create lava boundary
    const lavaGeometry = new THREE.TorusGeometry(this.size / 2, 2, 16, 100);
    const lavaMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4400,
      emissive: 0xff2200,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2
    });
    this.lavaBoundary = new THREE.Mesh(lavaGeometry, lavaMaterial);
    this.lavaBoundary.rotation.x = Math.PI / 2;
    this.lavaBoundary.position.y = -0.1;

    // Add to scene
    scene.add(this.lavaField);
    scene.add(this.mesh);
    scene.add(this.lavaBoundary);
  }

  public setSize(size: number) {
    this.size = size;
    const geometry = new THREE.PlaneGeometry(this.size, this.size);
    geometry.rotateX(-Math.PI / 2);
    this.mesh.geometry.dispose();
    this.mesh.geometry = geometry;

    // Update lava field
    const lavaFieldGeometry = new THREE.PlaneGeometry(this.size * 2, this.size * 2);
    lavaFieldGeometry.rotateX(-Math.PI / 2);
    this.lavaField.geometry.dispose();
    this.lavaField.geometry = lavaFieldGeometry;

    // Update lava boundary
    const lavaGeometry = new THREE.TorusGeometry(this.size / 2, 2, 16, 100);
    this.lavaBoundary.geometry.dispose();
    this.lavaBoundary.geometry = lavaGeometry;
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

  public setLavaColor(color: number) {
    const lavaMaterial = this.lavaBoundary.material as THREE.MeshStandardMaterial;
    const lavaFieldMaterial = this.lavaField.material as THREE.MeshStandardMaterial;
    lavaMaterial.color.setHex(color);
    lavaFieldMaterial.color.setHex(color);
  }

  public setLavaEmissiveIntensity(intensity: number) {
    const lavaMaterial = this.lavaBoundary.material as THREE.MeshStandardMaterial;
    const lavaFieldMaterial = this.lavaField.material as THREE.MeshStandardMaterial;
    lavaMaterial.emissiveIntensity = intensity;
    lavaFieldMaterial.emissiveIntensity = intensity;
  }

  public setLavaWidth(width: number) {
    const lavaGeometry = new THREE.TorusGeometry(this.size / 2, width, 16, 100);
    this.lavaBoundary.geometry.dispose();
    this.lavaBoundary.geometry = lavaGeometry;
  }

  public setLavaOpacity(opacity: number) {
    const lavaFieldMaterial = this.lavaField.material as THREE.MeshStandardMaterial;
    lavaFieldMaterial.opacity = opacity;
  }

  public dispose() {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
    if (this.lavaBoundary.parent) {
      this.lavaBoundary.parent.remove(this.lavaBoundary);
    }
    if (this.lavaField.parent) {
      this.lavaField.parent.remove(this.lavaField);
    }
    this.mesh.geometry.dispose();
    this.lavaBoundary.geometry.dispose();
    this.lavaField.geometry.dispose();
    this.material.dispose();
    (this.lavaBoundary.material as THREE.Material).dispose();
    (this.lavaField.material as THREE.Material).dispose();
    Object.values(this.textures).forEach(texture => texture.dispose());
  }
} 
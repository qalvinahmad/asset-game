import { GLView } from "expo-gl";
import { alignMesh, scaleLongestSideToSize } from "expo-three/build/utils";
import React, { Component } from "react";
import { Animated, PixelRatio, StyleSheet, View } from "react-native";
import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
} from "three";

import { CrossyRenderer } from "@/CrossyGame";
import ModelLoader from "@/ModelLoader";

// Ukuran untuk character
const size = 200;

interface CharacterCardProps {
  id: string;
  opacity: Animated.AnimatedInterpolation<string | number>; // Tambahkan opacity ke props
  style?: object;
}

export default class CharacterCard extends Component<CharacterCardProps> {
  scale = 0.5;
  raf: number | null = null; // Menambahkan raf untuk menyimpan ID animasi
  scene: Scene | null = null; // Menambahkan scene sebagai properti
  camera: PerspectiveCamera | null = null; // Menambahkan camera sebagai properti
  renderer: CrossyRenderer | null = null; // Menambahkan renderer sebagai properti
  character: Mesh | null = null; // Menambahkan properti untuk karakter

  state = {
    setup: false,
  };

  UNSAFE_componentWillMount() {
    // Menginisialisasi scene dan objek lain hanya jika belum ada
    if (!this.scene) this.scene = new Scene();
    if (!this.camera) this.camera = new PerspectiveCamera();
    
    this.lights();
    this.cameraSetup();
    this.character = this.loadCharacter();

    if (this.character) {
      this.scene.add(this.character); // Menambahkan karakter ke scene hanya jika valid
    }

    this.setState({ setup: true });
  }

  componentWillUnmount() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
  }

  lights = () => {
    if (this.scene) {
      this.scene.add(new AmbientLight(0xffffff, 0.9));
      let shadowLight = new DirectionalLight(0xffffff, 1);
      shadowLight.position.set(1, 1, 0); // Light from top
      this.scene.add(shadowLight);
    }
  };

  cameraSetup = () => {
    if (this.camera) {
      this.camera.position.z = 1.5;
      this.camera.position.y = 1;
      this.camera.lookAt(0, 0, 0);
    }

    this.updateCameraScale({
      width: size,
      height: size,
      scale: PixelRatio.get(),
    });
  };

  updateCameraScale = ({ width, height, scale }: { width: number; height: number; scale: number }) => {
    // Mengubah pengaturan kamera hanya jika camera sudah ada
    if (this.camera) {
      const fov = 75; // Menggunakan field of view untuk perspective camera
      const aspectRatio = width / height;
      this.camera.aspect = aspectRatio;
      this.camera.fov = fov; // Adjust fov untuk melihat objek secara proporsional
      this.camera.updateProjectionMatrix(); // Update proyeksi kamera setelah perubahan
    }
  };

  loadCharacter = (): Mesh | null => {
    try {
      // Pastikan ModelLoader mengembalikan node mesh yang valid
      const node = ModelLoader.load(this.props.id); // Mengganti dengan load yang sesuai
      if (node instanceof Mesh) {
        scaleLongestSideToSize(node, 1);
        alignMesh(node);

        // Menambahkan opacity ke material jika tersedia
        const material = node.material as MeshStandardMaterial;
        material.transparent = true;
        material.opacity = 1; // Default opacity, bisa diganti sesuai props

        return node;
      } else {
        console.warn("Character node is not a valid Mesh.");
        return null;
      }
    } catch (error) {
      console.error("Error loading character:", error);
      return null;
    }
  };

  tick = (dt: number) => {
    if (!this.state.setup || !this.character || !this.scene) {
      return;
    }
    this.character.rotation.y -= 0.03;

    // Set opacity berdasarkan interpolasi
    const material = this.character.material as MeshStandardMaterial;
    if (this.props.opacity instanceof Animated.Value) {
      material.opacity = this.props.opacity._value; // Mengambil nilai opacity dari Animated.Value
    }
  };

  pause() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
  }

  unpause() {
    const render = () => {
      this.raf = requestAnimationFrame(render);
      const time = Date.now();
      this.tick(time);
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      // pastikan renderer tidak null
      if (this.renderer && this.renderer.gl) {
        this.renderer.gl.endFrameEXP();
      }
    };
    render();
  }

  _onGLContextCreate = async (gl: WebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    this.renderer = new CrossyRenderer({
      gl,
      antialias: true,
      width,
      height,
    });

    this.unpause();
  };

  render() {
    if (this.state.setup) {
      return (
        <View
          pointerEvents={"none"}
          style={StyleSheet.flatten([styles.container, this.props.style])}
        >
          <View style={{ flex: 1 }}>
            <GLView
              style={{
                flex: 1,
                backgroundColor: "orange",
                height: "100%",
                overflow: "hidden",
              }}
              onContextCreate={this._onGLContextCreate}
            />
          </View>
        </View>
      );
    }

    return null; // Untuk menghindari return null saat setup belum selesai
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: size,
    height: size,
    justifyContent: "center",
  },
});

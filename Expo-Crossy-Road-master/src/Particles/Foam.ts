import { Bounce, Power2, TweenLite, TweenMax } from 'gsap'; // Pastikan TweenLite juga diimport
import { DoubleSide, Mesh, MeshPhongMaterial, Object3D, PlaneGeometry } from 'three';

const size = 0.6;

const material = new MeshPhongMaterial({
  color: 0xffffff,
  flatShading: true,
  side: DoubleSide,
});

const geometry = new PlaneGeometry(size, size, 1); // Ganti PlaneBufferGeometry dengan PlaneGeometry

export default class Foam extends Object3D {
  parts: Mesh[] = [];
  direction: number;

  constructor(direction: number) {
    super();
    this.direction = direction;

    for (let i = 0; i < 6; i++) {
      const particle = new Mesh(geometry, material);
      particle.rotation.x = Math.PI / 2;
      particle.position.set(0, 0, 0);
      this.parts.push(particle);
      this.add(particle); // Memanggil metode add
    }
  }

  // Tentukan tipe parameter untuk 'type' dan 'direction'
  run = (type: string, direction: number) => {
    const rand = ({ min = 0, max = 1 }) => Math.random() * (max - min) + min;

    const scale = (scale: number, node: Mesh, duration: number, delay = 0) =>
      TweenMax.to(node.scale, duration, {
        x: scale,
        y: scale,
        z: scale,
        delay,
        // ease: Bounce.easeOut,
      });

    const setup = (n: Mesh, i: number) => {
      n.position.set(
        rand({ min: -0.1, max: 0.1 }),
        0,
        (0.6 / this.parts.length) * i + 0.2,
      );
      n.visible = true;

      const minScale = 0.01;
      n.scale.set(minScale, minScale, minScale);
      n.rotation.y = Math.random() * 0.6 - 0.3;
    };

    const animate = (n: Mesh, i: number) => {
      const mScale = 1;
      const mDuration = 0.4;
      const lDuration = 1.2;
      const totalDuration = mDuration + lDuration;

      const startDelay = totalDuration * 0.2 * i;
      TweenMax.to(n.scale, mDuration, {
        x: mScale,
        y: mScale,
        z: mScale,
        delay: startDelay,
        ease: Bounce.easeOut,
        onComplete: _ => {
          const lScale = 0.01;
          TweenLite.to(n.scale, lDuration, {
            x: lScale,
            y: lScale,
            z: lScale,
            ease: Power2.easeIn,
          });

          TweenMax.to(n.position, lDuration, {
            x: n.position.x + rand({ min: 0.2, max: 1.0 }) * this.direction,
            onComplete: () => runAnimation(n, i),
          });
        },
      });
    };

    const runAnimation = (n: Mesh, i: number) => {
      setup(n, i);
      animate(n, i);
    };

    for (let i = 0; i < this.parts.length; i++) {
      let p = this.parts[i];
      runAnimation(p, i);
    }
  };
}

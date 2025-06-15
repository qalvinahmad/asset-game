import gsap from 'gsap';
import { BoxGeometry, Group, Mesh, MeshPhongMaterial } from 'three';

export default class Water {
  constructor() {
    this.waterMat = new MeshPhongMaterial({
      color: 0x71d7ff,
      flatShading: true,
    });
    this.mesh = new Group();
    const size = 0.2;
    const bigParticleGeom = new BoxGeometry(size, size + 0.1, size, 1);
    this.parts = [];
    for (let i = 0; i < 15; i++) {
      let partPink = new Mesh(bigParticleGeom, this.waterMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = () => {
    const explosionSpeed = 0.3;

    const removeParticle = (p) => {
      p.visible = false;
    };

    for (let i = 0; i < this.parts.length; i++) {
      let tx = -1.0 + Math.random() * 1.0;
      let ty = Math.random() * 2.0 + 1;
      let tz = -1.0 + Math.random() * 1.0;
      let p = this.parts[i];

      const bezier = {
        type: "cubic",
        values: [
          { x: 0, y: 0, z: 0 },
          { x: tx, y: ty, z: tz },
          { x: tx * 0.8, y: ty * 0.8, z: tz * 0.8 },
          {
            x: tx * (Math.random() * 0.5 + 1.1),
            y: 0,
            z: tz * (Math.random() * 0.5 + 1.1),
          },
        ],
        curviness: 0,
      };

      p.position.set(0, 0, 0);
      p.scale.set(1, 1, 1);
      p.visible = true;
      const s = explosionSpeed + Math.random() * 0.5;

      gsap.to(p.position, {
        duration: s * 4,
        bezier,
        ease: "bounce.out", // gunakan string ease seperti ini
      });

      const scaleTo = 0.01;
      gsap.to(p.scale, {
        duration: s,
        x: scaleTo,
        y: scaleTo,
        z: scaleTo,
        onComplete: removeParticle,
        onCompleteParams: [p],
        delay: s * 3,
      });
    }
  };
}

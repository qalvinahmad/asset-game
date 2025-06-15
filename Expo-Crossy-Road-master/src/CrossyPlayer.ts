import { utils } from "expo-three";
import { Bounce, gsap, Power1, TimelineMax } from "gsap";
import { Group, Vector3 } from "three";
import {
  BASE_ANIMATION_TIME,
  groundLevel,
  IDLE_DURING_GAME_PLAY,
  PLAYER_IDLE_SCALE,
  startingRow,
} from "./GameSettings";
import ModelLoader from "./ModelLoader";

const normalizeAngle = (angle: number): number => {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
};

class PlayerScaleAnimation {
  private timeline: GSAPTimeline;

  constructor(player: any) {
    this.timeline = gsap.timeline();
    this.timeline
      .to(player.scale, BASE_ANIMATION_TIME, {
        x: 1,
        y: 1.2,
        z: 1,
      })
      .to(player.scale, BASE_ANIMATION_TIME, {
        x: 1.0,
        y: 0.8,
        z: 1,
      })
      .to(player.scale, BASE_ANIMATION_TIME, {
        x: 1,
        y: 1,
        z: 1,
        ease: Bounce.easeOut,
      });
  }
}

class PlayerIdleAnimation extends TimelineMax {
  constructor(player: CrossyPlayer) {
    super({ repeat: -1 });

    this.to(player.scale, 0.3, {
      y: PLAYER_IDLE_SCALE,
      ease: Power1.easeIn,
    }).to(player.scale, 0.3, {
      y: 1,
      ease: Power1.easeOut,
    });
  }
}

class PlayerPositionAnimation extends TimelineMax {
  constructor(player: CrossyPlayer, { targetPosition, initialPosition, onComplete }: { targetPosition: Vector3, initialPosition: Vector3, onComplete: () => void }) {
    super({
      onComplete: () => onComplete(),
    });

    const delta = {
      x: targetPosition.x - initialPosition.x,
      z: targetPosition.z - initialPosition.z,
    };

    const inAirPosition = {
      x: initialPosition.x + delta.x * 0.75,
      y: targetPosition.y + 0.5,
      z: initialPosition.z + delta.z * 0.75,
    };

    this.to(player.position, BASE_ANIMATION_TIME, { ...inAirPosition })
      .to(player.position, BASE_ANIMATION_TIME, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
      });
  }
}

export default class CrossyPlayer extends Group {
  animations: any[] = [];
  private _character: any;
  private initialPosition: any;
  private targetPosition: any;
  private idleAnimation: PlayerIdleAnimation | null = null;
  private lastPosition: any;
  private moving: boolean = false;
  private hitBy: any = null;
  private ridingOn: any = null;
  private ridingOnOffset: any = null;
  public isAlive: boolean = true;

  constructor(character: string) {
    super();
    this.setCharacter(character);
    this.reset();
  }

  setCharacter(character: string) {
    if (this._character === character) return;
    this._character = character;
    const node = ModelLoader._hero.getNode(character);
    if (!node) {
      throw new Error(`Failed to get node for character: ${character}`);
    }

    if (this.node) {
      this.remove(this.node);
    }

    utils.scaleLongestSideToSize(node, 1);
    utils.alignMesh(node, { x: 0.5, z: 0.5, y: 1.0 });
    this.node = node;
    this.add(node);
  }

  moveOnEntity() {
    if (!this.ridingOn) {
      return;
    }

    this.position.x += this.ridingOn.speed;
    if (this.initialPosition) {
      this.initialPosition.x = this.position.x;
    }
  }

  moveOnCar() {
    if (!this.hitBy) {
      return;
    }

    this.position.x += this.hitBy.speed;
    if (this.initialPosition) {
      this.initialPosition.x = this.hitBy.mesh.position.x;
    }
  }

  stopAnimations() {
    this.animations.forEach((val) => {
      if (val.pause) {
        val.pause();
      }
    });
    this.animations = [];
  }

  reset() {
    this.position.set(0, groundLevel, startingRow);
    this.scale.set(1, 1, 1);
    this.rotation.set(0, Math.PI, 0);

    this.initialPosition = null;
    this.targetPosition = null;
    this.moving = false;
    this.hitBy = null;
    this.ridingOn = null;
    this.ridingOnOffset = null;
    this.isAlive = true;
  }

  skipPendingMovement() {
    if (!this.moving) {
      return;
    }
    this.position.set(
      this.targetPosition.x,
      this.targetPosition.y,
      this.targetPosition.z
    );
    if (this.targetRotation) {
      this.rotation.y = normalizeAngle(this.targetRotation);
    }
  }

  finishedMovingAnimation() {
    this.moving = false;
    if (IDLE_DURING_GAME_PLAY) {
      if (this.idleAnimation) {
        this.idleAnimation.play();
      } else {
        this.idle();
      }
    }
    this.lastPosition = this.position;
  }

  stopIdle() {
    if (this.idleAnimation && this.idleAnimation.pause) {
      this.idleAnimation.pause();
    }
    this.idleAnimation = null;
    this.scale.set(1, 1, 1);
  }

  idle() {
    if (this.idleAnimation) {
      return;
    }
    this.stopIdle();
    this.idleAnimation = new PlayerIdleAnimation(this);
  }

  createPositionAnimation({ onComplete }) {
    return new PlayerPositionAnimation(this, {
      onComplete: () => {
        this.finishedMovingAnimation();
        onComplete();
      },
      targetPosition: this.targetPosition,
      initialPosition: this.initialPosition,
    });
  }

  commitMovementAnimations({ onComplete }) {
    const positionChangeAnimation = this.createPositionAnimation({
      onComplete,
    });

    this.animations = [
      positionChangeAnimation,
      new PlayerScaleAnimation(this),
      gsap.to(this.rotation, BASE_ANIMATION_TIME, {
        y: this.targetRotation,
        ease: Power1.easeInOut,
        onComplete: () => {
          // Normalize the rotation without returning anything.
          this.rotation.y = normalizeAngle(this.rotation.y);
        },
      }),
      
    ];

    this.initialPosition = this.targetPosition;
  }

  runPosieAnimation() {
    this.stopIdle();

    gsap.to(this.scale, 0.2, {
      x: 1.2,
      y: 0.75,
      z: 1,
    });
  }

  collideWithCar(road, car) {
    if (this.moving && Math.abs(this.position.z - Math.round(this.position.z)) > 0.1) {
      this.getHitByCar(road, car);
    } else {
      this.getRunOverByCar(road, car);
    }
  }

  getRunOverByCar(road, car) {
    this.position.y = road.top - 0.05;

    gsap.to(this.scale, 0.2, {
      y: 0.05,
      x: 1.7,
      z: 1.7,
    });
    gsap.to(this.rotation, 0.2, {
      y: Math.random() * Math.PI - Math.PI / 2,
    });
  }

  getHitByCar(road, car) {
    this.hitBy = car;

    const forward = this.position.z - Math.round(this.position.z) > 0;
    this.position.z = road.position.z + (forward ? 0.52 : -0.52);

    gsap.to(this.scale, 0.15, {
      y: 1.5,
      z: 0.2,
    });
    gsap.to(this.rotation, 0.15, {
      z: Math.random() * Math.PI - Math.PI / 2,
    });
  }
}

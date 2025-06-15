import { Audio } from "expo-av";
import { Platform } from 'react-native';
import AudioFiles from "./Audio";

// Web just can't seem to handle audio
const MUTED = Platform.OS === "web";

interface Sounds {
  chicken: {
    move: { [key: number]: Audio.Sound };
    die: { [key: number]: Audio.Sound };
  };
  car: {
    passive: { [key: string]: Audio.Sound };
    die: { [key: string]: Audio.Sound };
  };
  [key: string]: any;
}

class AudioManager {
  sounds: Sounds = AudioFiles;

  audioFileMoveIndex = 0;

  playMoveSound = async () => {
    await this.playAsync(
      this.sounds.chicken.move[this.audioFileMoveIndex]
    );
    this.audioFileMoveIndex =
      (this.audioFileMoveIndex + 1) %
      Object.keys(this.sounds.chicken.move).length;
  };

  playPassiveCarSound = async () => {
    if (Math.floor(Math.random() * 2) === 0) {
      await this.playAsync(this.sounds.car.passive[`1`]);
    }
  };

  playDeathSound = async () => {
    await this.playAsync(
      this.sounds.chicken.die[Math.floor(Math.random() * 2)]
    );
  };

  playCarHitSound = async () => {
    await this.playAsync(
      this.sounds.car.die[Math.floor(Math.random() * 2)]
    );
  };

  _soundCache: Record<number, Audio.Sound[]> = {};

  getIdleSoundAsync = async (resourceId: number) => {
    if (this._soundCache[resourceId]) {
      for (const sound of this._soundCache[resourceId]) {
        const status = await sound.getStatusAsync();
        if (status && 'isPlaying' in status && !status.isPlaying) {
          return sound;
        }
      }
    }
    return null;
  };

  createIdleSoundAsync = async (resourceId: number) => {
    if (!this._soundCache[resourceId]) {
      this._soundCache[resourceId] = [];
    }
    const tag = "loaded-sound-" + resourceId;
    console.time(tag);
    const { sound } = await Audio.Sound.createAsync(resourceId);
    console.timeEnd(tag);
    this._soundCache[resourceId].push(sound);
    return sound;
  };

  playAsync = async (soundObject: number | Audio.Sound) => {
    if (MUTED) return;

    if (soundObject instanceof Audio.Sound) {
      return await soundObject.playAsync();
    }

    let sound = await this.getIdleSoundAsync(soundObject);
    if (!sound) {
      sound = await this.createIdleSoundAsync(soundObject);
    } else {
      await sound.setPositionAsync(0);
    }
    return await sound.playAsync();
  };

  stopAsync = async (name: string) => {
    if (name in this.sounds) {
      const soundObject = this.sounds[name];
      try {
        await soundObject.stopAsync();
      } catch (error) {
        console.warn("Error stopping audio", { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };

  volumeAsync = async (name: string, volume: number) => {
    if (name in this.sounds) {
      const soundObject = this.sounds[name];
      try {
        await soundObject.setVolumeAsync(volume);
      } catch (error) {
        console.warn("Error setting volume of audio", { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };

  pauseAsync = async (name: string) => {
    if (name in this.sounds) {
      const soundObject = this.sounds[name];
      try {
        await soundObject.pauseAsync();
      } catch (error) {
        console.warn("Error pausing audio", { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };

  get assets() {
    return AudioFiles;
  }

  setupAsync = async () => {
    // noop -- maybe preload some common sounds upfront
    return true;
  };
}

export default new AudioManager();

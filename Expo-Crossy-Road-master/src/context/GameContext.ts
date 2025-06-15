import { Character } from '@/Characters';
import { createContext } from 'react';

export default createContext({ character: 'juwan', setCharacter(randomCharacter: Character) {}, highscore: 0, setHighscore(score: number) {}, });

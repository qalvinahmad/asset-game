#ifndef GAME_H
#define GAME_H

#include <SDL2/SDL.h>
#include "Player.h"

class Game {
public:
    Game();  // Konstruktor
    void init(SDL_Renderer* renderer);  // Inisialisasi game
    void render(SDL_Renderer* renderer);  // Render elemen game

private:
    SDL_Renderer* renderer;
    Player* player;  // Menambahkan objek Player
};

#endif

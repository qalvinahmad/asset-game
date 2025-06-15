#ifndef PLAYER_H
#define PLAYER_H

#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>

class Player {
public:
    Player(SDL_Renderer* renderer);
    void handleInput();
    void move();
    void render(SDL_Renderer* renderer);
    
    // Tambahkan getter untuk x dan y
    int getX() const { return x; }
    int getY() const { return y; }

private:
    SDL_Renderer* renderer;
    SDL_Texture* playerTexture;
    int x, y;        // Posisi pemain
    int speed;       // Kecepatan pemain
};

#endif

#include "Player.h"

Player::Player(SDL_Renderer* renderer)


    : renderer(renderer), x(100), y(100), speed(5) {
    playerTexture = IMG_LoadTexture(renderer, "assets/images/player.png");
    if (!playerTexture) {
        SDL_Log("Failed to load player texture: %s", SDL_GetError());
    } else {
        SDL_Log("Player texture loaded successfully.");
    }
}




void Player::handleInput() {
    const Uint8* keystate = SDL_GetKeyboardState(nullptr);
    if (keystate[SDL_SCANCODE_LEFT]) {
        x -= speed;
    }
    if (keystate[SDL_SCANCODE_RIGHT]) {
        x += speed;
    }
    if (keystate[SDL_SCANCODE_UP]) {
        y -= speed;
    }
    if (keystate[SDL_SCANCODE_DOWN]) {
        y += speed;
    }
}

void Player::move() {
    // Tambahkan logika tambahan di sini jika diperlukan
}

void Player::render(SDL_Renderer* renderer) {
    SDL_Rect renderQuad = { x, y, 64, 64 }; // Pastikan ukuran dan posisi benar
    SDL_RenderCopy(renderer, playerTexture, nullptr, &renderQuad);
}


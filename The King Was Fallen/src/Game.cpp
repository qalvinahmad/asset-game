#include "Game.h"

Game::Game() : renderer(nullptr), player(nullptr) {
    SDL_Log("Game constructor called");
}

void Game::init(SDL_Renderer* renderer) {
    this->renderer = renderer;
    SDL_Log("Game init started");
    
    // Create player instance
    player = new Player(renderer);
    SDL_Log("Player created");
}

void Game::render(SDL_Renderer* renderer) {
    SDL_Log("Render started");
    
    // Set background color (blue)
    SDL_SetRenderDrawColor(renderer, 0, 0, 255, 255);
    if (SDL_RenderClear(renderer) != 0) {
        SDL_Log("RenderClear failed: %s", SDL_GetError());
    }
    
    // Check if clearing worked
    Uint8 r, g, b, a;
    SDL_GetRenderDrawColor(renderer, &r, &g, &b, &a);
    SDL_Log("Current render color: R=%d, G=%d, B=%d, A=%d", r, g, b, a);
    
    if (player) {
        SDL_Log("Rendering player");
        player->render(renderer);
    } else {
        SDL_Log("Player is null!");
    }
    
    SDL_RenderPresent(renderer);
}
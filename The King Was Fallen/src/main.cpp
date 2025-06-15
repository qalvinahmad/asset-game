#include <SDL2/SDL.h>
#include "Game.h"



int main() {
    // Di awal main.cpp, tambahkan:
SDL_LogSetAllPriority(SDL_LOG_PRIORITY_INFO);
// Optional: log ke file
SDL_LogSetOutputFunction([](void *userdata, int category, SDL_LogPriority priority, const char *message) {
    FILE* logFile = fopen("game.log", "a");
    if (logFile) {
        fprintf(logFile, "%s\n", message);
        fclose(logFile);
    }
}, nullptr);

    SDL_Log("Starting game initialization...");
    
    if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
        SDL_Log("SDL Init Error: %s", SDL_GetError());
        return 1;
    }
    SDL_Log("SDL initialized successfully");

    if (!(IMG_Init(IMG_INIT_PNG) & IMG_INIT_PNG)) {
    SDL_Log("SDL_image could not initialize! SDL_image Error: %s\n", IMG_GetError());
    return 1;
}

    SDL_Window* window = SDL_CreateWindow("Game",
        SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
        800, 600, SDL_WINDOW_SHOWN);
    
    if (!window) {
        SDL_Log("Window creation error: %s", SDL_GetError());
        return 1;
    }
    SDL_Log("Window created successfully");

    SDL_Renderer* renderer = SDL_CreateRenderer(window, -1,
        SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
    
    if (!renderer) {
        SDL_Log("Renderer creation error: %s", SDL_GetError());
        return 1;
    }
    SDL_Log("Renderer created successfully");

    // Buat instance dari Game
    Game game;
    game.init(renderer);  // Inisialisasi game

    // Game loop
    bool running = true;
    while (running) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT) {
                running = false;
            }
        }

        // Gunakan metode render dari class Game
        game.render(renderer);
        SDL_Log("Game rendered");
    }

    // Cleanup
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}
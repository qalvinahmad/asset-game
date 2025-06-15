#include "Map.h"
#include <fstream>
#include <sstream>
#include <SDL2/SDL_image.h>

Map::Map(SDL_Renderer* renderer) : renderer(renderer), tileTexture(nullptr) {
    // Memuat texture tile
    tileTexture = IMG_LoadTexture(renderer, "assets/images/tile.png");
}

Map::~Map() {
    if (tileTexture) {
        SDL_DestroyTexture(tileTexture);
    }
}

void Map::load(const char* fileName) {
    std::ifstream file(fileName);
    if (!file.is_open()) {
        SDL_Log("Failed to open map file!");
        return;
    }

    // Memuat peta
    std::string line;
    int y = 0;
    while (std::getline(file, line) && y < 10) {
        std::stringstream ss(line);
        int x = 0;
        while (ss >> map[x][y]) {
            if (ss.peek() == ' ') ss.ignore();
            ++x;
        }
        ++y;
    }
}

void Map::render() {
    for (int y = 0; y < 10; ++y) {
        for (int x = 0; x < 10; ++x) {
            int tileType = map[x][y];
            if (tileType != 0) {
                int screenX = (x - y) * 32;
                int screenY = (x + y) * 16;
                SDL_Rect renderQuad = { screenX, screenY, 64, 32 };
                SDL_RenderCopy(renderer, tileTexture, nullptr, &renderQuad);
            }
        }
    }
}

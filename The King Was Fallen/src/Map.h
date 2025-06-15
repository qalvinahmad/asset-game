#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>

class Map {
public:
    Map(SDL_Renderer* renderer);
    ~Map();
    void load(const char* fileName);
    void render();
private:
    SDL_Renderer* renderer;
    SDL_Texture* tileTexture;
    int map[100][100];
};

#include "Utils.h"

int isoX(int x, int y, int tileWidth, int tileHeight) {
    return (x - y) * tileWidth / 2;
}

int isoY(int x, int y, int tileWidth, int tileHeight) {
    return (x + y) * tileHeight / 2;
}

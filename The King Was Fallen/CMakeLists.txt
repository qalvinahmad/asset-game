cmake_minimum_required(VERSION 3.10)

# Nama proyek
project(TheKingWasFallen)

# Tentukan standar C++ yang digunakan
set(CMAKE_CXX_STANDARD 11)

# Cari SDL2 dan SDL2_image secara otomatis
find_package(SDL2 REQUIRED)
find_package(SDL2_image REQUIRED)

# Tentukan direktori sumber kode
include_directories(${SDL2_INCLUDE_DIRS} ${SDL2_IMAGE_INCLUDE_DIRS} src)

# Tentukan file sumber
set(SOURCES
    src/main.cpp
    src/Game.cpp
    src/Map.cpp
    src/Player.cpp
    src/Utils.cpp
)

# Tentukan executable
add_executable(TheKingWasFallen ${SOURCES})

# Tentukan direktori link (optional jika diperlukan)
link_directories("/opt/homebrew/Cellar/sdl2/2.26.5/lib")
link_directories("/opt/homebrew/Cellar/sdl2_image/2.8.4/lib")

# Link dengan SDL2 dan SDL2_image
target_link_libraries(TheKingWasFallen 
    ${SDL2_LIBRARIES} 
    ${SDL2_IMAGE_LIBRARIES}
    /opt/homebrew/Cellar/sdl2_image/2.8.4/lib/libSDL2_image-2.0.0.dylib  # Menambahkan SDL2_image secara manual jika perlu
)

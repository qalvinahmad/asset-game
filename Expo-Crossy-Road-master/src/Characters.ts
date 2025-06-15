// Menggunakan tipe CharactersType untuk memastikan index signature
const Characters: CharactersType = {
  bacon: {
    name: "Bacon",
    id: "bacon",
    index: 0
  },
  brent: {
    name: "Brent Vatne",
    id: "brent",
    index: 1
  },
  avocoder: {
    name: "Avocoder",
    id: "avocoder",
    index: 2
  },
  wheeler: {
    name: "Wheeler",
    id: "wheeler",
    index: 3
  },
  palmer: {
    name: "Palmer",
    id: "palmer",
    index: 4
  },
  juwan: {
    name: "Juwan",
    id: "juwan",
    index: 5
  },
};

export default Characters;

export type Character = {
  index: any;
  name: string;
  id: string;
  
};

export type CharactersType = {
  [key: string]: Character; // Index signature with string key
};
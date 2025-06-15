import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet } from "react-native";

import Characters from "@/Characters";
import GameContext from "@/context/GameContext";

// Define types for the context
interface GameContextType {
  setCharacter: (id: string) => void;
  character: string;
}

export default function CharacterPicker() {
  // Use the context with proper types
  const { setCharacter, character } = React.useContext(GameContext) as unknown as GameContextType;

  return (
    <Picker
      selectedValue={character}
      style={styles.picker}
      onValueChange={(itemValue: string) => {
        setCharacter(itemValue);
      }}
    >
      {Object.keys(Characters).map((id) => (
        <Picker.Item
          key={id}
          label={Characters[id].name}
          value={Characters[id].id}
        />
      ))}
    </Picker>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 48,
    minWidth: 100,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#75C5F4",
    color: "white",
    fontFamily: "retro",
  },
});

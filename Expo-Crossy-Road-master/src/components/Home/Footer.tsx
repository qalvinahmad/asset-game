import Images from "@/Images";
import React from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import Button from "../Button"; // Sesuaikan dengan path Button yang benar
import CharacterPicker from "../CharacterPicker";

interface FooterProps {
  onMultiplayer: () => void;
  onShop: () => void;
  onCamera: () => void;
  onCharacterSelect: () => void;
  style?: object; // Optional style prop
}

const imageStyle = { width: 60, height: 48 };

const Footer: React.FC<FooterProps> = (props) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [characterKey, setCharacterKey] = React.useState("brent");

  const collapse = React.useCallback(
    (onPress: () => void) => () => {
      setMenuOpen(false);
      onPress();
    },
    [setMenuOpen]
  );

  const renderMenu = React.useMemo(() => {
    return (
      <View style={{ flexDirection: "column" }}>
        <Button
          onPress={collapse(props.onMultiplayer)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.controller}
        />
        <Button
          onPress={collapse(props.onShop)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.shop}
        />
        <Button
          onPress={collapse(props.onCamera)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.camera}
        />
      </View>
    );
  }, [collapse, props.onMultiplayer, props.onShop, props.onCamera]);

  return (
    <Animated.View style={[styles.container, props.style]}>
      <TouchableOpacity
        style={{ zIndex: 10 }}
        onPress={props.onCharacterSelect}
      >
        <Button
          style={{ maxHeight: 48 }}
          onPress={props.onCharacterSelect}
          imageStyle={imageStyle}
          source={Images.button.character}
        />
      </TouchableOpacity>

      {false && <CharacterPicker />}

      <View style={{ flex: 1 }} />

      <View style={{ flexDirection: "column-reverse" }}>
        <Button
          onPress={() => {
            setMenuOpen(!menuOpen);
          }}
          style={[{ opacity: menuOpen ? 0.8 : 1.0 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.menu}
        />

        {menuOpen && renderMenu}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "row",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});

export default Footer;

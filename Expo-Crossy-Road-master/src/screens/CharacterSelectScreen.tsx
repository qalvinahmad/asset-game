import GameContext from "@/context/GameContext"; // Pastikan context ini ada
import { useNavigation } from "@react-navigation/native"; // Hook untuk navigasi
import React, { useContext, useEffect, useState } from "react";
import { Share, StyleSheet, View } from "react-native";

import Characters from "@/Characters"; // Jika ekspor default

import Colors from "@/Colors";
import Button from "@/components/Button";
import Carousel from "@/components/CharacterSelect/Carousel";
import Images from "@/Images";

const CharacterSelect = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const characters = Object.keys(Characters).map((key) => Characters[key]);

  const navigation = useNavigation(); // Menggunakan hook untuk navigasi
  const { setCharacter } = useContext(GameContext); // Mengambil setCharacter dari context

  useEffect(() => {
    // Set default character to brent
    setCharacter("brent");
  }, []);

  const dismiss = () => {
    navigation.goBack();
  };

  const pickRandom = () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];
    setCharacter(randomCharacter); // Set karakter yang dipilih
    dismiss();
  };

  const select = () => {
    const selectedCharacter = characters[currentIndex];
    setCharacter(selectedCharacter); // Set karakter yang dipilih
    dismiss();
  };

  const share = () => {
    const character = characters[currentIndex].name;
    Share.share(
      {
        message: `${character}! #BouncyBacon @expo`,
        url: "https://blockgocrossing.netlify.com",
        title: "Block Go Crossing",
      },
      {
        dialogTitle: "Share Block Go Crossing",
        excludedActivityTypes: [
          "com.apple.UIKit.activity.AirDrop",
          "com.apple.UIKit.activity.AddToReadingList",
        ],
        tintColor: Colors.blue,
      }
    );
  };

  const imageStyle = { width: 60, height: 48 };

  return (
    <View style={[styles.container]}>
      <View style={{ flexDirection: "row", marginTop: 8, paddingHorizontal: 4 }}>
        <Button
          source={Images.button.back}
          imageStyle={imageStyle}
          onPress={dismiss} style={undefined}        />
      </View>

      <Carousel onCurrentIndexChange={setCurrentIndex} />

      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 8 }}>
        <Button
          source={Images.button.random}
          imageStyle={imageStyle}
          onPress={pickRandom} style={undefined}        />
        <Button
          source={Images.button.long_play}
          imageStyle={{ width: 90, height: 48 }}
          onPress={select} style={undefined}        />
        <Button
          source={Images.button.social}
          imageStyle={imageStyle}
          onPress={share} style={undefined}        />
      </View>
    </View>
  );
};

export default CharacterSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "rgba(105, 201, 230, 0.8)",
  },
});

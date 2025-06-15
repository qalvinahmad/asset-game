import { isAvailableAsync } from "expo-sharing";
import React, { useEffect, useState } from "react";
import { LayoutAnimation, Share, StyleSheet, View, ViewStyle } from "react-native";

import Colors from "@/Colors";
import Images from "@/Images";
import State from "@/state";
import Button from "../Button";

// Define the type for props
interface FooterProps {
  style?: ViewStyle; // style is optional, typically a ViewStyle
  showSettings: () => void; // showSettings is a function that doesn't return anything
  setGameState: (state: string) => void;
  navigation: any; // you can replace `any` with a more specific type if you know the structure of the navigation object
}

const Footer: React.FC<FooterProps> = ({ style, showSettings, setGameState, navigation }) => {
  const [canShare, setCanShare] = useState(true);
  const [isSharing, setIsSharing] = useState(false); // Add this state to track if share is in progress

  useEffect(() => {
    isAvailableAsync()
      .then(setCanShare)
      .catch(() => {});
  }, []);

  LayoutAnimation.easeInEaseOut();

  const shareAsync = async () => {
    if (isSharing) return; // Prevent multiple shares at the same time

    try {
      setIsSharing(true); // Set sharing state to true

      await Share.share(
        {
          message: `Check out Block Go Crossing by @baconbrix`,
          url: "https://blockgocrossing.netlify.com",
          title: "Block Go Crossing",
        },
        {
          dialogTitle: "Share Block Go Crossing",
          excludedActivityTypes: [
            "com.apple.UIKit.activity.AirDrop", // This speeds up showing the share sheet by a lot
            "com.apple.UIKit.activity.AddToReadingList", // This is just lame :)
          ],
          tintColor: Colors.blue,
        }
      );
    } catch (error) {
      console.error("Error sharing: ", error); // Optional: Handle error if needed
    } finally {
      setIsSharing(false); // Reset sharing state after share operation completes
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Button
        onPress={() => {
          showSettings();
        } }
        imageStyle={[styles.button, { aspectRatio: 1.25 }]}
        source={Images.button.settings} style={undefined}      />
      {canShare && (
        <Button
          onPress={shareAsync}
          imageStyle={[styles.button, { marginRight: 4, aspectRatio: 1.9 }]}
          source={Images.button.share} style={undefined}        />
      )}
      <Button
        onPress={() => {
          setGameState(State.Game.none);
        } }
        imageStyle={[
          styles.button,
          { marginLeft: canShare ? 4 : 0, aspectRatio: 1.9 },
        ]}
        source={Images.button.long_play} style={undefined}      />
      <Button
        onPress={() => {
          console.log("Game Center"); //TODO: Add GC
        } }
        imageStyle={[styles.button, { aspectRatio: 1.25 }]}
        source={Images.button.rank} style={undefined}      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    justifyContent: "space-around",
    flexDirection: "row",
    paddingHorizontal: 4,
    minHeight: 56,
    maxHeight: 56,
    minWidth: "100%",
    maxWidth: "100%",
    flex: 1,
  },
  button: {
    height: 56,
  },
});

export default Footer;

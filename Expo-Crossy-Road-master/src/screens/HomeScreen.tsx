import Hand from "@/components/HandCTA";
import Footer from "@/components/Home/Footer";
import GameContext from "@/context/GameContext";
import React from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Tipe untuk props HomeScreen
interface HomeScreenProps {
  coins: number; // Properti coins yang merupakan angka
  onPlay: () => void; // Fungsi onPlay yang dipanggil ketika pengguna menekan tombol
}

let hasShownTitle = false;

function Screen(props: HomeScreenProps) {
  const { setCharacter, character } = React.useContext(GameContext);
  const animation = new Animated.Value(0);

  React.useEffect(() => {
    function onKeyUp(event: KeyboardEvent) {
      const { keyCode } = event;
      // Space, up-arrow
      if ([32, 38].includes(keyCode)) {
        props.onPlay();
      }
    }

    window.addEventListener("keyup", onKeyUp, false);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  React.useEffect(() => {
    // Set default character to brent
    setCharacter("brent");
  }, []);

  React.useEffect(() => {
    if (!hasShownTitle) {
      hasShownTitle = true;

      Animated.timing(animation, {
        useNativeDriver: Platform.OS !== "web", // Gunakan Platform.OS untuk mengecek apakah itu web atau tidak
        toValue: 1,
        duration: 800,
        delay: 0,
      }).start();
    }
  }, []);

  const { top, bottom, left, right } = useSafeAreaInsets();

  const animatedTitleStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-Dimensions.get("window").width, 0],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
  };

  const handlePressIn = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: Platform.OS !== "web", // Gunakan Platform.OS di sini juga
      easing: Easing.in(Easing.cubic), // Ganti ke cubic
    }).start(() => {
      // Setelah animasi selesai, panggil props.onPlay()
      props.onPlay();
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
    >
      {/* Bagian Tombol Gambar / Animasi */}
      <TouchableOpacity
        activeOpacity={1.0}
        style={[{ justifyContent: "center", alignItems: "center" }, styles.touchableArea]}
        onPressIn={handlePressIn}
      >
        <Text style={styles.coins}>{props.coins}</Text>
        <Animated.Image
          source={require("../../assets/images/title.png")}
          style={[styles.title, animatedTitleStyle]}
        />
      </TouchableOpacity>

      {/* Footer Area */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "stretch",
          position: "absolute",
          bottom: Math.max(bottom, 8),
          left: Math.max(left, 8),
          right: Math.max(right, 8),
        }}
      >
        <View style={{ height: 64, marginBottom: 48, alignItems: "center" }}>
          {!__DEV__ && <Hand style={{ width: 36 }} />}
        </View>
        <Footer
          onCharacterSelect={() => {
            // TODO(Bacon): Create a character select page
            console.log("Character select button pressed");
          }}
          onShop={() => {}}
          onMultiplayer={() => {}}
          onCamera={() => {}}
        />
      </View>
    </View>
  );
}

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    resizeMode: "contain",
    maxWidth: 600,
    width: "80%",
    height: 300,
  },
  coins: {
    fontFamily: "retro",
    position: "absolute",
    right: 8,
    color: "#f8e84d",
    fontSize: 36,
    letterSpacing: 0.9,
    backgroundColor: "transparent",
    textAlign: "right",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  touchableArea: {
    // Tambahkan margin atau padding untuk membatasi area yang bisa di-klik
    padding: 20,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});

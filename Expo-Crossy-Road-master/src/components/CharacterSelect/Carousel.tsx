// Carousel.tsx

import Characters from "@/Characters"; // Pastikan path-nya sesuai
import React, { Component } from "react";
import { Animated, Dimensions, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
import PagerView from 'react-native-pager-view';
import CharacterCard from "./CharacterCard";

const width = 150;
const AnimatedText = Animated.createAnimatedComponent(Text);

const keys = Object.keys(Characters);

// Tipe untuk item yang diterima dalam renderItem
type RenderItemProps = {
  item: string;  // Tipe untuk item sesuai dengan kunci di Characters
  index: number; // Indeks item saat ini
};

type State = {
  index: number;
};

type NativeEvent = NativeSyntheticEvent<NativeScrollEvent>;

type CarouselProps = {
  onCurrentIndexChange: (index: number) => void;  // Menambahkan properti ini
};

export default class Carousel extends Component<CarouselProps, State> {
  scroll = new Animated.Value(0);
  viewPager: PagerView | null = null;

  state: State = {
    index: 0,
  };

  // Menggunakan RenderItemProps untuk mendefinisikan tipe parameter
  renderItem = ({ item, index }: RenderItemProps) => {
    const inset = width * 0.75;
    const offset = index * width;
    const inputRange = [offset - width, offset, offset + width];
  
    return (
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          transform: [
            {
              scale: this.scroll.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              }),
            },
            {
              translateX: this.scroll.interpolate({
                inputRange: [
                  offset - width * 2,
                  offset - width,
                  offset,
                  offset + width,
                  offset + width * 2,
                ],
                outputRange: [-inset * 3, -inset, 0, inset, inset * 3],
              }),
            },
          ],
        }}
      >
        <CharacterCard
          opacity={this.scroll.interpolate({
            inputRange: [
              index * width - width,
              index * width,
              index * width + width,
            ],
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
          })}
          {...Characters[item]} // Setiap item di Characters diteruskan sebagai props ke CharacterCard
        />
      </Animated.View>
    );
  };

  momentumScrollEnd = () => {
    console.log("Momentum scroll end");
  };

  render() {
    const { index } = this.state;

    let key = keys[index];
    let character;

    if (key) {
      character = Characters[key].name;
    }

    return (
      <View style={{ flex: 1 }}>
        <AnimatedText style={styles.text}>
          {character || "null l0l"}
        </AnimatedText>
        <PagerView
          ref={(ref) => (this.viewPager = ref)}
          style={styles.container}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: (Dimensions.get("window").width - width) / 2,
          }}
          snapToInterval={width}
          onMomentumScrollEnd={this.momentumScrollEnd}
          onScroll={(event: NativeEvent) => {
            if (!this.viewPager) {
              return;
            }
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const position = Math.floor(contentOffsetX / width);
            if (this.state.index !== position) {
              this.setState({ index: position });
              this.props.onCurrentIndexChange(position); // Mengirim indeks saat ini ke parent
            }
          }}
          keyExtractor={(item: string, index: number) => `-${index}`}
          data={keys}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    opacity: 1,
    fontFamily: "retro",
    backgroundColor: "transparent",
    textAlign: "center",
    color: "white",
    fontSize: 32,
  },
});

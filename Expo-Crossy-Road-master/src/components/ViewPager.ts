import React, { Component } from "react";
import { Animated, FlatList, Platform, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

// Define the props interface for the component
interface ViewPagerProps {
  size?: number;
  data: any[];
  renderItem: (info: { item: any, index: number }) => React.ReactNode;
  decelerationRate?: number;
  keyExtractor?: (item: any, index: number) => string;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  snapToAlignment?: "start" | "center" | "end";
  onEndReachedThreshold?: number;
  horizontal?: boolean;
  useNativeDriver?: boolean;
  initialIndex?: number;
  scroll?: Animated.Value;
  onRefresh?: () => void;
  refreshing?: boolean;
  onEndReached?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  onRef?: (ref: FlatList<any> | null) => void;
  getItemLayout?: (data: any[], index: number) => { length: number, offset: number, index: number };
  contentContainerStyle?: any;  // Make this optional
}

interface ViewPagerState {
  width: number;
  height: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class ViewPager extends Component<ViewPagerProps, ViewPagerState> {
  static defaultProps = {
    decelerationRate: 0,
    keyExtractor: (item: any, index: number) => `vp-${index}`,
    onScroll: () => {},
    snapToAlignment: "start",
    onEndReachedThreshold: 50,
    horizontal: true,
    useNativeDriver: Platform.OS !== "web",
    initialIndex: 0,
    scroll: new Animated.Value(0),
  };

  private list: typeof AnimatedFlatList | null = null;

  constructor(props: ViewPagerProps) {
    super(props);
    const { scroll, horizontal, size, useNativeDriver } = props;

    // Scroll event listener setup with Animated.event
    this.state = {
      width: horizontal ? size || 0 : 0,
      height: !horizontal ? size || 0 : 0,
      onScroll: this.setupOnScroll(useNativeDriver, horizontal),
    };
  }

  get size() {
    return this.props.size ?? this.state.width;
  }

  get offset() {
    const { scroll } = this.props;
    return scroll?.__getValue() || 0;  // Use __getValue instead of accessing value directly
  }

  get index() {
    return Math.round(this.offset / this.size);
  }

  set index(index: number) {
    this.scrollToIndex({ index });
  }

  componentDidMount() {
    const { initialIndex = 0 } = this.props;
    this.scrollToIndex({ index: initialIndex, animated: false });
  }

  componentDidUpdate(prevProps: ViewPagerProps) {
    if (prevProps.useNativeDriver !== this.props.useNativeDriver || prevProps.horizontal !== this.props.horizontal) {
      this.setState({
        onScroll: this.setupOnScroll(this.props.useNativeDriver, this.props.horizontal),
      });
    }
  }

  scrollToIndex = ({ index, ...props }: { index: number; animated?: boolean }) => {
    const { data } = this.props;
    const maxItems = data.length - 1;

    if (this.list) {
      this.list.scrollToIndex({
        index: Math.max(0, Math.min(index, maxItems)),
        ...props,
      });
    }
  };

  next = (animated: boolean) => this.scrollToIndex({ index: this.index + 1, animated });

  previous = (animated: boolean) => this.scrollToIndex({ index: this.index - 1, animated });

  setupOnScroll = (useNativeDriver: boolean | undefined, horizontal: boolean | undefined) => {
    const key = horizontal ? "x" : "y";
    return Animated.event(
      [
        {
          nativeEvent: { contentOffset: { [key]: this.props.scroll } },
        },
      ],
      {
        useNativeDriver,
      }
    );
  };

  keyExtractor = (item: any, index: number) => index.toString();

  getItemLayout = (data: any[], index: number) => ({
    length: this.size,
    offset: this.size * index,
    index,
  });

  get contentContainerStyle() {
    const { horizontal } = this.props;
    if (horizontal) {
      const offset = (this.state.width - this.size) / 2;
      return {
        paddingHorizontal: offset,
      };
    } else {
      const offset = (this.state.height - this.size) / 2;
      return {
        paddingVertical: offset,
      };
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const { onLayout, horizontal } = this.props;
    const {
      nativeEvent: {
        layout: { width, height },
      },
    } = event;

    if (horizontal) {
      if (width !== this.state.width) {
        this.setState({ width, height });
      }
    } else {
      if (height !== this.state.height) {
        this.setState({ width, height });
      }
    }

    onLayout?.(event);
  };

  render(): React.ReactNode {
    const {
      data,
      renderItem,
      onRef,
      getItemLayout,
      snapToAlignment,  // Use as a prop now
      keyExtractor,
      contentContainerStyle,
      onRefresh,
      refreshing,
      decelerationRate,
      onEndReached,
      onEndReachedThreshold,
      ...props
    } = this.props;

    return (
      <AnimatedFlatList
        onLayout={this.onLayout}
        onScroll={this.state.onScroll}
        ref={(ref) => {
          this.list = ref;
          onRef?.(ref);
        }}
        removeClippedSubviews
        keyExtractor={keyExtractor || this.keyExtractor}
        data={data}
        snapToAlignment={snapToAlignment}  // Corrected to pass as prop
        snapToInterval={this.size}  // Corrected to pass as prop
        decelerationRate={decelerationRate}
        contentContainerStyle={[
          this.contentContainerStyle,
          contentContainerStyle,
        ]}
        getItemLayout={getItemLayout || this.getItemLayout}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={onEndReachedThreshold}
        {...props}
      />
    );
  }
}

export default ViewPager;

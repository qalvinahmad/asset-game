import React, { Component } from "react";
import { PanResponder, PanResponderGestureState, StyleSheet, View } from "react-native";

export const swipeDirections = {
  SWIPE_UP: "SWIPE_UP",
  SWIPE_DOWN: "SWIPE_DOWN",
  SWIPE_LEFT: "SWIPE_LEFT",
  SWIPE_RIGHT: "SWIPE_RIGHT",
};

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

// Type for the swipe configuration
interface SwipeConfig {
  velocityThreshold: number;
  directionalOffsetThreshold: number;
}

// Type for the gesture event state
interface GestureState {
  dx: number;
  dy: number;
  vx: number;
  vy: number;
}

// Type for the component's props
interface GestureViewProps {
  config?: SwipeConfig;
  onResponderGrant: () => void;
  onSwipe?: (direction: string, gestureState: GestureState) => void;
  onSwipeUp?: (gestureState: GestureState) => void;
  onSwipeDown?: (gestureState: GestureState) => void;
  onSwipeLeft?: (gestureState: GestureState) => void;
  onSwipeRight?: (gestureState: GestureState) => void;
  onTap?: (gestureState: GestureState) => void;
  style?: object;
}

class GestureView extends Component<GestureViewProps> {
  // Declare the swipeConfig property with type
  swipeConfig: SwipeConfig;
  _panResponder: any;

  constructor(props: GestureViewProps) {
    super(props);
    // Merge provided config with default config
    this.swipeConfig = { ...swipeConfig, ...props.config };
    this._panResponder = PanResponder.create({
      onResponderGrant: () => this.props.onResponderGrant(),
      onStartShouldSetPanResponder: this._handleShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleShouldSetPanResponder,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  // Handle prop changes
  UNSAFE_componentWillReceiveProps(props: GestureViewProps) {
    this.swipeConfig = { ...swipeConfig, ...props.config };
  }

  // Should set pan responder
  _handleShouldSetPanResponder = (evt: any, gestureState: PanResponderGestureState) => {
    evt.preventDefault();
    return evt.nativeEvent.touches.length === 1;
  };

  // Check if the gesture is a click (minimal movement)
  _gestureIsClick = (gestureState: GestureState) => {
    return Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
  };

  // Handle the end of a pan responder
  _handlePanResponderEnd = (evt: any, gestureState: PanResponderGestureState) => {
    evt.preventDefault();
    const swipeDirection = this._getSwipeDirection(gestureState);
    this._triggerSwipeHandlers(swipeDirection, gestureState);
  };

  // Trigger the corresponding swipe handler
  _triggerSwipeHandlers = (swipeDirection: string, gestureState: GestureState) => {
    const {
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight,
      onTap,
    } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;

    onSwipe && onSwipe(swipeDirection, gestureState);
    switch (swipeDirection) {
      case SWIPE_LEFT:
        onSwipeLeft && onSwipeLeft(gestureState);
        break;
      case SWIPE_RIGHT:
        onSwipeRight && onSwipeRight(gestureState);
        break;
      case SWIPE_UP:
        onSwipeUp && onSwipeUp(gestureState);
        break;
      case SWIPE_DOWN:
        onSwipeDown && onSwipeDown(gestureState);
        break;
      default:
        onTap && onTap(gestureState);
        break;
    }
  };

  // Get the swipe direction based on gesture
  _getSwipeDirection = (gestureState: GestureState) => {
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    const { dx, dy } = gestureState;
    if (this._isValidHorizontalSwipe(gestureState)) {
      return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
    } else if (this._isValidVerticalSwipe(gestureState)) {
      return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
    }
    return null;
  };

  // Check if the horizontal swipe is valid
  _isValidHorizontalSwipe = (gestureState: GestureState) => {
    const { vx, dy } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  };

  // Check if the vertical swipe is valid
  _isValidVerticalSwipe = (gestureState: GestureState) => {
    const { vy, dx } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  };

  render() {
    const { style = {}, ...props } = this.props;

    return (
      <View
        style={StyleSheet.flatten([{ flex: 1 }, style])}
        {...props}
        {...this._panResponder.panHandlers}
      />
    );
  }
}

// Utility function to check if swipe is valid based on velocity and offset
function isValidSwipe(
  velocity: number,
  velocityThreshold: number,
  directionalOffset: number,
  directionalOffsetThreshold: number
): boolean {
  return (
    Math.abs(velocity) > velocityThreshold &&
    Math.abs(directionalOffset) < directionalOffsetThreshold
  );
}

export default GestureView;

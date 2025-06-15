import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { PanResponder, PanResponderGestureState, PanResponderInstance, View } from "react-native";

const getElement = (component: React.Component<any, any> | null): HTMLElement | null => {
  try {
    return findDOMNode(component) as HTMLElement;
  } catch (e) {
    return null;
  }
};

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

export const keyMap: Record<string, string> = {
  Space: "SWIPE_UP",
  ArrowUp: "SWIPE_UP",
  KeyW: "SWIPE_UP",
  ArrowDown: "SWIPE_DOWN",
  KeyS: "SWIPE_DOWN",
  ArrowLeft: "SWIPE_LEFT",
  KeyA: "SWIPE_LEFT",
  ArrowRight: "SWIPE_RIGHT",
  KeyD: "SWIPE_RIGHT",
};

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

const freezeBody = (e: Event) => {
  e.preventDefault();
};

interface GestureViewProps {
  config?: typeof swipeConfig;
  onResponderGrant: () => void;
  onSwipe: (direction: string, gestureState: PanResponderGestureState) => void;
  onSwipeUp?: (gestureState: PanResponderGestureState) => void;
  onSwipeDown?: (gestureState: PanResponderGestureState) => void;
  onSwipeLeft?: (gestureState: PanResponderGestureState) => void;
  onSwipeRight?: (gestureState: PanResponderGestureState) => void;
  onTap?: (gestureState: PanResponderGestureState) => void;
  style?: object;
}

class GestureView extends Component<GestureViewProps> {
  private _panResponder: PanResponderInstance;
  private swipeConfig: typeof swipeConfig;
  private view: HTMLElement | null = null;

  constructor(props: GestureViewProps) {
    super(props);
    this.swipeConfig = { ...swipeConfig, ...props.config };
    this._panResponder = PanResponder.create({
      onPanResponderStart: () => {
        this.props.onResponderGrant();
      },
      onStartShouldSetPanResponder: this._handleShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleShouldSetPanResponder,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("keyup", this.onKeyUp, false);
  }

  componentWillUnmount() {
    if (this.view) {
      this.view.removeEventListener("touchstart", this.touchStart, false);
      this.view.removeEventListener("touchmove", freezeBody, false);
    }
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  UNSAFE_componentWillReceiveProps(props: GestureViewProps) {
    this.swipeConfig = { ...swipeConfig, ...props.config };
  }

  onKeyDown = (e: KeyboardEvent) => {
    const direction = keyMap[e.code];
    if (direction) {
      this.props.onResponderGrant();
    }
  };

  onKeyUp = (e: KeyboardEvent) => {
    const direction = keyMap[e.code];
    if (direction) {
      this.props.onSwipe(direction, {} as PanResponderGestureState); // You may want to pass a gesture state here
    }
  };

  _handleShouldSetPanResponder = (evt: React.SyntheticEvent<TouchEvent>, gestureState: PanResponderGestureState): boolean => {
    evt.preventDefault();
    const touchEvent = evt.nativeEvent as TouchEvent;
    return touchEvent.touches.length === 1;  // Access touches from TouchEvent
  };

  _gestureIsClick = (gestureState: PanResponderGestureState): boolean => {
    return Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
  };

  _handlePanResponderEnd = (evt: React.SyntheticEvent<TouchEvent>, gestureState: PanResponderGestureState): void => {
    evt.preventDefault();
    const swipeDirection = this._getSwipeDirection(gestureState);
    this._triggerSwipeHandlers(swipeDirection, gestureState);
  };

  _triggerSwipeHandlers = (swipeDirection: string | null, gestureState: PanResponderGestureState): void => {
    const {
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight,
      onTap,
    } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    onSwipe && onSwipe(swipeDirection!, gestureState);
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

  _getSwipeDirection = (gestureState: PanResponderGestureState): string | null => {
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    const { dx, dy } = gestureState;
    if (this._isValidHorizontalSwipe(gestureState)) {
      return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
    } else if (this._isValidVerticalSwipe(gestureState)) {
      return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
    }
    return null;
  };

  _isValidHorizontalSwipe = (gestureState: PanResponderGestureState): boolean => {
    const { vx, dy } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  };

  _isValidVerticalSwipe = (gestureState: PanResponderGestureState): boolean => {
    const { vy, dx } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  };

  touchStart = (evt: TouchEvent) => {
    console.log("touch start");
    this.props.onResponderGrant();
  };

  render() {
    const { style, ...props } = this.props;

    return (
      <View
        style={[{ flex: 1, cursor: "pointer" }, style]}
        tabIndex={0}
        ref={(view) => {
          const nextView = getElement(view);
          if (nextView && nextView instanceof HTMLElement) {
            nextView.addEventListener("touchstart", this.touchStart, false);
            nextView.addEventListener("touchmove", freezeBody, false);
          }
          this.view = nextView instanceof HTMLElement ? nextView : null;
        }}
        {...props}
        {...this._panResponder.panHandlers}
      />
    );
  }
}

export default GestureView;

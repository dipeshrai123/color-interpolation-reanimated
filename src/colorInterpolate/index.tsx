import React, { useRef } from "react";
import { View, processColor } from "react-native";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { withTimingTransition } from "./animation";

const {
  Value,
  color,
  set,
  cond,
  neq,
  eq,
  interpolate,
  Extrapolate,
  block,
  useCode,
  event
} = Animated;

const colorAlpha = (num: number) => ((num >> 24) & 255) / 255;
const colorRed = (num: number) => (num >> 16) & 255;
const colorGreen = (num: number) => (num >> 8) & 255;
const colorBlue = (num: number) => (num >> 0) & 255;

type configType = {
  inputRange: readonly Animated.Adaptable<number>[],
  outputRange: readonly Animated.Adaptable<number | string>[]
};

const colorInterpolate = (
  value: Animated.Adaptable<number>,
  config: configType
) => {

  const outputRange = config.outputRange.map(color => processColor(color));

  const r = interpolate(value, {
    inputRange: config.inputRange,
    outputRange: outputRange.map(color => colorRed(color)),
    extrapolate: Extrapolate.CLAMP
  });

  const g = interpolate(value, {
    inputRange: config.inputRange,
    outputRange: outputRange.map(color => colorGreen(color)),
    extrapolate: Extrapolate.CLAMP
  });

  const b = interpolate(value, {
    inputRange: config.inputRange,
    outputRange: outputRange.map(color => colorBlue(color)),
    extrapolate: Extrapolate.CLAMP
  });

  const a = interpolate(value, {
    inputRange: config.inputRange,
    outputRange: outputRange.map(color => colorAlpha(color)),
    extrapolate: Extrapolate.CLAMP
  });

  return color(r, g, b, a);
}

const ColorInterpolate = () => {
  const open = useRef(new Value(0)).current;
  const state = useRef(new Value(State.UNDETERMINED)).current;
  const animation = withTimingTransition(open);

  const interpolation = colorInterpolate(animation, {
    inputRange: [0, 1],
    outputRange: ["#000000", "#FF0000"]
  });

  const textStyles = {
    color: interpolation
  };

  useCode(() => block([
    cond(eq(state, State.END), [
      cond(neq(open, 1), set(open, 1), set(open, 0))
    ])
  ]), []);

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <TapGestureHandler onHandlerStateChange={event([{
        nativeEvent: {
          state
        }
      }])}>
        <Animated.Text
          style={[textStyles]}
        >
          Dipesh Rai
        </Animated.Text>
      </TapGestureHandler>
    </View>
  )
}

export default ColorInterpolate;
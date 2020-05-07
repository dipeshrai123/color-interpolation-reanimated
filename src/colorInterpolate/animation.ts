import Animated, { Easing, clockRunning } from "react-native-reanimated";

const {
  Value,
  set,
  cond,
  neq,
  Clock,
  startClock,
  stopClock,
  block,
  timing
} = Animated;

export function runTiming(
  value: Animated.Adaptable<number>, 
  destination: Animated.Adaptable<number>
) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0)
  };

  const config = {
    toValue: new Value(0),
    duration: 4000,
    easing: Easing.inOut(Easing.ease)
  };

  const clock = new Clock();
  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(config.toValue, destination),
      set(state.position, value),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ]);
}

export function withTimingTransition(
  value: Animated.Adaptable<number>
) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0)
  };

  const config = {
    toValue: new Value(0),
    duration: 1000,
    easing: Easing.inOut(Easing.ease)
  };

  const clock = new Clock();

  return block([
    startClock(clock),
    cond(neq(config.toValue, value), [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(config.toValue, value)
    ]),
    timing(clock, state, config),
    state.position
  ]);
}
/**
 * Animation utilities for page transitions and layout animations
 */

import { Animated, Easing } from 'react-native';
import type { TransitionConfig, EasingType } from '@/types/dashboard-schema';

export function getTransitionAnimation(
  type: string,
  duration: number = 300,
  easing?: EasingType
): Animated.CompositeAnimation {
  const easingFn = getEasingFunction(easing);

  return Animated.timing(new Animated.Value(0), {
    toValue: 1,
    duration,
    easing: easingFn,
    useNativeDriver: true,
  });
}

export function getEasingFunction(easing?: EasingType): ((value: number) => number) {
  switch (easing) {
    case 'linear':
      return Easing.linear;
    case 'easeIn':
      return Easing.in(Easing.ease);
    case 'easeOut':
      return Easing.out(Easing.ease);
    case 'easeInOut':
      return Easing.inOut(Easing.ease);
    case 'easeInQuad':
      return Easing.in(Easing.quad);
    case 'easeOutQuad':
      return Easing.out(Easing.quad);
    case 'easeInOutQuad':
      return Easing.inOut(Easing.quad);
    case 'easeInCubic':
      return Easing.in(Easing.cubic);
    case 'easeOutCubic':
      return Easing.out(Easing.cubic);
    case 'easeInOutCubic':
      return Easing.inOut(Easing.cubic);
    default:
      return Easing.inOut(Easing.ease);
  }
}

export function createFadeAnimation(
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = 300
): Animated.CompositeAnimation {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true,
  });
}

export function createSlideAnimation(
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = 300,
  direction: 'left' | 'right' | 'up' | 'down' = 'left'
): Animated.CompositeAnimation {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
}

export function createScaleAnimation(
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = 300
): Animated.CompositeAnimation {
  return Animated.spring(animatedValue, {
    toValue,
    friction: 8,
    tension: 40,
    useNativeDriver: true,
  });
}

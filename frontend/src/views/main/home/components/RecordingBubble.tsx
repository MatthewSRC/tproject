import { useTheme } from "@shopify/restyle";
import { useEffect } from "react";
import Animated, {
  SharedValue,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { width } from "~/theme/layout";
import { Theme } from "~/theme/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function RecordingBubble({ currentStatus }: Props) {
  const theme = useTheme<Theme>();

  const outerMaxRadius = (width * 45) / 100;
  const outerMinRadius = (width * 40) / 100;
  const outerCircleRadius = useSharedValue(outerMaxRadius);
  function outerAnimations(duration: number) {
    return [
      withTiming(outerMinRadius, { duration }),
      withTiming(outerMaxRadius, { duration }),
    ];
  }
  const outerAnimatedProps = useAnimatedProps(() => ({
    r: outerCircleRadius.value,
  }));

  const innerMaxRadius = (width * 38) / 100;
  const innerMinRadius = (width * 35) / 100;
  const innerCircleRadius = useSharedValue(innerMinRadius);
  function innerAnimations(duration: number) {
    return [
      withTiming(innerMaxRadius, { duration }),
      withTiming(innerMinRadius, { duration }),
    ];
  }
  const innerAnimatedProps = useAnimatedProps(() => ({
    r: innerCircleRadius.value,
  }));

  function startCircleAnimation(
    animatedValue: SharedValue<number>,
    baseRadius: number,
    animations: number[],
    pauseDuration: number
  ) {
    animatedValue.value = withRepeat(
      withSequence(
        withTiming(baseRadius, { duration: pauseDuration }),
        ...animations
      ),
      -1
    );
  }

  function stopCircleAnimation(
    toStop: SharedValue<number>,
    maxRadius: number,
    stopDuration: number
  ) {
    cancelAnimation(toStop);
    toStop.value = withTiming(maxRadius, { duration: stopDuration });
  }

  useEffect(() => {
    if (currentStatus !== "WAITING") {
      stopCircleAnimation(outerCircleRadius, outerMaxRadius, 500);
      stopCircleAnimation(innerCircleRadius, innerMinRadius, 500);
      setTimeout(() => {
        startCircleAnimation(
          outerCircleRadius,
          outerMaxRadius,
          outerAnimations(500),
          25
        );
        startCircleAnimation(
          innerCircleRadius,
          innerMinRadius,
          innerAnimations(500),
          25
        );
      }, 500);
    } else {
      stopCircleAnimation(outerCircleRadius, outerMaxRadius, 2000);
      stopCircleAnimation(innerCircleRadius, innerMinRadius, 2000);
      setTimeout(() => {
        startCircleAnimation(
          outerCircleRadius,
          outerMaxRadius,
          outerAnimations(2000),
          100
        );
        startCircleAnimation(
          innerCircleRadius,
          innerMinRadius,
          innerAnimations(2000),
          100
        );
      }, 2000);
    }
    return () => {
      stopCircleAnimation(outerCircleRadius, outerMaxRadius, 500);
      stopCircleAnimation(innerCircleRadius, innerMinRadius, 500);
    };
  }, [currentStatus]);

  return (
    <Svg>
      <AnimatedCircle
        cx="50%"
        cy="50%"
        fill={theme.colors.secondary}
        r={outerCircleRadius.value}
        animatedProps={outerAnimatedProps}
      />
      <AnimatedCircle
        cx="50%"
        cy="50%"
        fill={theme.colors.primary}
        r={innerCircleRadius.value}
        animatedProps={innerAnimatedProps}
      />
    </Svg>
  );
}

interface Props {
  currentStatus: SpeechifyStatus;
}

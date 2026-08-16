import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  Button,
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  AnimatedStyle,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

const Box = ({
  style,
  children,
}: {
  style?: AnimatedStyle<ViewStyle>;
  children?: React.ReactNode;
}) => {
  return (
    <Animated.View
      style={[
        {
          width: 200,
          height: 200,
          backgroundColor: "blue",
          borderRadius: 16,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Pan gesture
const PanGestureExample = () => {
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd((e) => {
      start.value = offset.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: offset.value.x,
      },
      {
        translateY: offset.value.y,
      },
    ],
  }));

  return (
    <View style={{ flex: 1 }}>
      <Text>Pan Gesture</Text>
      <Text>Drag the box around</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <GestureDetector gesture={panGesture}>
          <Box style={animatedStyle} />
        </GestureDetector>
      </View>
    </View>
  );
};

// Tap gesture
const TapGestureExample = () => {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .maxDuration(500)
    .onBegin((e) => {
      scale.value = withSpring(1.5);
    })
    .onFinalize((e) => {
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <Text>Tap Gesturea</Text>
      <Text>Tap the box</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <GestureDetector gesture={tapGesture}>
          <Box style={animatedStyle} />
        </GestureDetector>
      </View>
    </View>
  );
};

// Long Press Gesture Example
const LongPressGestureExample = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      scale.value = withSpring(1.3);
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      opacity.value = withTiming(0.5);
    })
    .onFinalize(() => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      scale.value = withSpring(1);
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      opacity.value = withTiming(1);
    });

  return (
    <View style={{ flex: 1 }}>
      <Text>Long Press Gesture</Text>
      <Text>Tap the box</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <GestureDetector gesture={longPressGesture}>
          <Box style={animatedStyles} />
        </GestureDetector>
      </View>
    </View>
  );
};

// Rotation Gesture Example
const RotationGestureExample = () => {
  const rotation = useSharedValue(0);
  const [rotationText, setRotationText] = useState("0.00");

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}rad` }],
  }));

  useAnimatedReaction(
    () => rotation.value,
    (current, previous) => {
      if (current !== previous) {
        scheduleOnRN(setRotationText, current.toFixed(2));
      }
    },
  );

  const rotationGesture = Gesture.Rotation().onUpdate((e) => {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
    rotation.value = e.rotation;
  });

  return (
    <View style={{ flex: 1 }}>
      <Text>Rotation Gesture</Text>
      <Text>Rotation the box</Text>
      <Text>rotation.value: {rotationText} rad</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <GestureDetector gesture={rotationGesture}>
          <Box style={animatedStyles} />
        </GestureDetector>
      </View>
    </View>
  );
};

// Pinch Gesture Example
const PinchGestureExample = () => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  return (
    <View style={{ flex: 1 }}>
      <Text>Pinch Gesture</Text>
      <Text>Pinch the box</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <GestureDetector gesture={pinchGesture}>
          <Box style={animatedStyles} />
        </GestureDetector>
      </View>
    </View>
  );
};

// Fling Gesture Example
const FlingGestureExample = () => {
  const position = useSharedValue(0);
  const flingGesture = Gesture.Simultaneous(
    Gesture.Fling()
      .direction(Directions.RIGHT)
      .onStart((e) => {
        position.value = withTiming(position.value + 40, { duration: 100 });
      }),
    Gesture.Fling()
      .direction(Directions.LEFT)
      .onStart((e) => {
        position.value = withTiming(position.value - 40, { duration: 100 });
      }),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <Text>Fling Gesture</Text>
      <Text>Quickly swipe left or right to fling the box.</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <GestureDetector gesture={flingGesture}>
          <Box style={animatedStyle} />
        </GestureDetector>
      </View>
    </View>
  );
};

// Composed Gestures Example
const ComposedGesturesExample = () => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  const translateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: offset.value.x,
      },
      {
        translateY: offset.value.y,
      },
    ],
  }));

  const rotateScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotateZ: `${rotation.value}rad` }],
  }));
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd((e) => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Simultaneous(rotationGesture, panGesture),
  );

  return (
    <View style={{ flex: 1 }}>
      <Text>Composed Gesture</Text>
      <Text>Pinch and rotate the box simultaneously</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <GestureDetector gesture={composed}>
          <Animated.View style={translateStyle}>
            <Box style={rotateScaleStyle} />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

// Race Gestures Example
const RaceGesturesExample = () => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotateZ: `${rotation.value}rad` }],
  }));

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue mutation is the intended API
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Race(pinchGesture, rotationGesture);

  return (
    <View style={{ flex: 1 }}>
      <Text>Race Gesture</Text>
      <Text>Race between pinch and rotate</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <GestureDetector gesture={composed}>
          <Box style={animatedStyles} />
        </GestureDetector>
      </View>
    </View>
  );
};

const SwipeableComponent = () => {
  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>,
  ) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 50 }],
    }));

    return (
      <Pressable onPress={() => alert("You have pressed right action!")}>
        <Animated.View
          style={[
            styleAnimation,
            {
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: 50,
              borderWidth: 1,
              backgroundColor: "white",
              borderLeftWidth: 0,
            },
          ]}
        >
          <MaterialIcons name="restore-from-trash" color={"red"} />
        </Animated.View>
      </Pressable>
    );
  };
  const LeftAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value - 50 }],
    }));

    return (
      <Pressable onPress={() => alert("You have pressed left action!")}>
        <Animated.View
          style={[
            styleAnimation,
            {
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: 50,
              borderWidth: 1,
              backgroundColor: "white",
              borderRightWidth: 0,
            },
          ]}
        >
          <MaterialIcons name="check-circle" color={"green"} />
        </Animated.View>
      </Pressable>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <Text>Swipeable Component</Text>
      <ScrollView contentContainerStyle={{ rowGap: 12, marginTop: 16 }}>
        {["😅 item 1", "🚀 item 2", "📢 new course!"].map((item) => (
          <ReanimatedSwipeable
            key={item}
            renderRightActions={RightAction}
            renderLeftActions={LeftAction}
            friction={2}
            rightThreshold={40}
            enableTrackpadTwoFingerGesture
          >
            <View
              style={{
                width: "100%",
                height: 50,
                borderWidth: 1,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{item}</Text>
            </View>
          </ReanimatedSwipeable>
        ))}
      </ScrollView>
    </View>
  );
};
export default function GesturesAndAnimations() {
  const [selectedExample, setSelectedExample] = useState("pan");

  const examples = {
    pan: <PanGestureExample />,
    tap: <TapGestureExample />,
    longPress: <LongPressGestureExample />,
    rotation: <RotationGestureExample />,
    pinch: <PinchGestureExample />,
    fling: <FlingGestureExample />,
    composed: <ComposedGesturesExample />,
    race: <RaceGesturesExample />,
    swipeable: <SwipeableComponent />,
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={{ paddingHorizontal: 16, fontWeight: "bold" }}>
          Select an example
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 50 }}
          contentContainerStyle={{ gap: 8, marginTop: 3, paddingLeft: 16 }}
        >
          {Object.keys(examples).map((example) => (
            <Button
              title={example}
              key={example}
              onPress={() => setSelectedExample(example)}
            ></Button>
          ))}
        </ScrollView>
        <View style={{ paddingHorizontal: 16, flex: 1 }}>
          {examples[selectedExample as keyof typeof examples]}
        </View>
      </View>
    </SafeAreaView>
  );
}

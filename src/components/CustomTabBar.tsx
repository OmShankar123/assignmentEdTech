import React, { useEffect } from 'react';
import { Platform, Pressable, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { Colors } from '@/theme/colors';

import Typography from './Typography';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute self-center w-[90%] h-16 bg-white rounded-[32px] shadow-lg z-50"
      style={{
        bottom: insets.bottom + 10,
        ...Platform.select({
          android: { elevation: 4 },
          ios: { elevation: 10 },
        }),
      }}
    >
      <View className="flex-1 flex-row justify-around items-center px-2">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              label={options.title || route.name}
              name={route.name}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

interface TabItemProps {
  isFocused: boolean;
  label: string;
  onPress: () => void;
  name: string;
}

function TabItem({ isFocused, label, onPress, name }: TabItemProps) {
  const activeValue = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    activeValue.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  }, [isFocused, activeValue]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isFocused ? 1.2 : 1) }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: activeValue.value,
      transform: [
        {
          translateY: interpolate(activeValue.value, [0, 1], [10, 0]),
        },
      ],
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        activeValue.value,
        [0, 1],
        ['transparent', Colors.primary + '20'],
      ),
      paddingHorizontal: withTiming(isFocused ? 16 : 0),
      borderRadius: 20,
    };
  });

  const animatedTabItemStyle = useAnimatedStyle(() => {
    return {
      flex: withTiming(isFocused ? 1.5 : 1),
    };
  });

  const getIconName = (routeName: string): keyof typeof Feather.glyphMap => {
    switch (routeName) {
      case 'index':
        return 'home';
      case 'bookmarks':
        return 'bookmark';
      case 'profile':
        return 'user';
      default:
        return 'help-circle';
    }
  };

  return (
    <Animated.View className="items-center justify-center h-full" style={[animatedTabItemStyle]}>
      <Pressable className="w-full h-full items-center justify-center" onPress={onPress}>
        <Animated.View
          className="flex-row items-center justify-center h-10"
          style={[animatedBackgroundStyle]}
        >
          <Animated.View style={animatedIconStyle}>
            <Feather
              color={isFocused ? Colors.primary : Colors.secondary}
              name={getIconName(name)}
              size={22}
            />
          </Animated.View>
          {isFocused && (
            <Animated.View className="overflow-hidden" style={[animatedTextStyle]}>
              <Typography
                className="ml-2 text-primary"
                numberOfLines={1}
                variant="bodySmallSemiBold"
              >
                {label}
              </Typography>
            </Animated.View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

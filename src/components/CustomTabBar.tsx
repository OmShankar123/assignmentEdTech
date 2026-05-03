import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
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

const TAB_BAR_HEIGHT = 64;
const TAB_BAR_WIDTH_PERCENT = 90;

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 10,
        },
      ]}
    >
      <View style={styles.content}>
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
    <Animated.View style={[styles.tabItem, animatedTabItemStyle]}>
      <Pressable style={styles.pressable} onPress={onPress}>
        <Animated.View style={[styles.tabContent, animatedBackgroundStyle]}>
          <Animated.View style={animatedIconStyle}>
            <Feather
              color={isFocused ? Colors.primary : Colors.secondary}
              name={getIconName(name)}
              size={22}
            />
          </Animated.View>
          {isFocused && (
            <Animated.View style={[styles.labelContainer, animatedTextStyle]}>
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    width: `${TAB_BAR_WIDTH_PERCENT}%`,
    height: TAB_BAR_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        elevation: 10,
      },
    }),
    zIndex: 100,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  pressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  labelContainer: {
    overflow: 'hidden',
  },
});

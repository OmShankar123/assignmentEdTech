import React from 'react';
import { TouchableOpacity, View, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Typography from './Typography';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  style?: ViewStyle;
  showBackButton?: boolean;
  backButtonText?: string;
  leftIcon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  backButtonText,
  leftIcon,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View className="bg-transparent z-10">
      <View className="h-12 flex-row items-center">
        {leftIcon ? (
          <View className="justify-center items-center mr-2">{leftIcon}</View>
        ) : (
          showBackButton && (
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-center bg-gray-100 w-10 h-10 rounded-xl"
              onPress={handleBackPress}
            >
              <Feather color="#000000" name="arrow-left" size={20} />
              {backButtonText && (
                <Typography className="ml-1 text-black" variant="bodySemiBold">
                  {backButtonText}
                </Typography>
              )}
            </TouchableOpacity>
          )
        )}
        {title && (
          <View className="justify-center ml-3">
            <Typography className="text-black" variant="h3">
              {title}
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
};

export default Header;

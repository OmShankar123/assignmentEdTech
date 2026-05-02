import React from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IMAGES } from '@/assets';
import FullscreenLoader from '@/components/FullScreenLoader';

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  showLoader?: boolean;
  scrollable?: boolean;
  showBackgroundShape?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  className = '',
  showLoader = false,
  scrollable = false,
  showBackgroundShape = true,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle = {
    paddingBottom: insets.bottom,
    paddingTop: insets.top,
  };

  const content = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 px-5"
    >
      {scrollable ? (
        <ScrollView
          className={className}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 ${className}`}>{children}</View>
      )}
    </KeyboardAvoidingView>
  );

  if (showBackgroundShape) {
    return (
      <View className="flex-1 bg-white">
        <ImageBackground
          className="flex-1"
          resizeMode="cover"
          source={IMAGES.background}
          style={containerStyle}
        >
          {content}
          <FullscreenLoader visible={showLoader} />
        </ImageBackground>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={containerStyle}>
      {content}
      <FullscreenLoader visible={showLoader} />
    </View>
  );
};

export default ScreenWrapper;

import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FullscreenLoader from '@/components/FullScreenLoader';

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  showLoader?: boolean;
  scrollable?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  className = '',
  showLoader = false,
  scrollable = false,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle = {
    paddingBottom: insets.bottom,
    paddingTop: insets.top,
  };

  if (scrollable) {
    return (
      <View className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={containerStyle}
          className={className}
        >
          {children}
        </ScrollView>
        <FullscreenLoader visible={showLoader} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={containerStyle}>
      <View className={`flex-1 ${className}`}>{children}</View>
      <FullscreenLoader visible={showLoader} />
    </View>
  );
};

export default ScreenWrapper;

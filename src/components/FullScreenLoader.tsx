import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';

interface FullscreenLoaderProps {
  visible: boolean;
  size?: 'small' | 'large';
  color?: string;
}

const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({
  visible = false,
  size = 'large',
  color = '#000000',
}) => {
  const { t } = useTranslation();

  return (
    <ReactNativeModal
      coverScreen
      statusBarTranslucent
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0}
      isVisible={visible}
      style={{ margin: 0 }}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="p-5 rounded-xl items-center justify-center">
          <ActivityIndicator color={color} size={size} />
          <Text className="text-white text-sm font-semibold mt-2">
            {t('common.loading') || 'Loading...'}
          </Text>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default FullscreenLoader;

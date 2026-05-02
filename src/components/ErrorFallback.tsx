import React from 'react';
import { Text, View } from 'react-native';
import RNRestart from 'react-native-restart';

import Button from '@/components/Button';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const handleRestart = () => {
    resetError();
    RNRestart.restart();
  };

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <View className="w-full items-center">
        <Text className="text-2xl font-bold text-black mb-4 text-center">
          Oops! Something went wrong.
        </Text>
        <Text className="text-base text-gray-500 text-center mb-6">
          We apologize for the inconvenience. Please try again or restart the app.
        </Text>
        <Text className="text-sm text-red-500 text-center mb-8 p-4 bg-red-50 rounded-lg w-full">
          {error.toString()}
        </Text>
        <Button
          className="w-full"
          testID="try-again-button"
          title="Try Again"
          onPress={handleRestart}
        />
      </View>
    </View>
  );
};

export default ErrorFallback;

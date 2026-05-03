import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Typography from './Typography';

interface BottomAlertProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  type?: 'default' | 'destructive';
}

const BottomAlert = ({
  isVisible,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  type = 'default',
}: BottomAlertProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <View className="items-center">
          <Pressable
            className="w-full bg-white rounded-t-[24px] pt-3 px-6 items-center shadow-lg"
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="w-10 h-1 bg-gray-200 rounded-full mb-6" />

            <Typography className="mb-3 text-center" variant="h2">
              {title}
            </Typography>

            <Typography className="mb-8 text-center text-secondary" variant="body">
              {message}
            </Typography>

            <View className="flex-row w-full gap-4">
              <Pressable
                className="flex-1 h-14 bg-gray-100 rounded-2xl justify-center items-center active:bg-gray-200"
                onPress={onClose}
              >
                <Typography className="text-secondary" variant="button">
                  {cancelText}
                </Typography>
              </Pressable>

              <Pressable
                className={`flex-1 h-14 rounded-2xl justify-center items-center active:opacity-80 ${
                  type === 'destructive' ? 'bg-red-500' : 'bg-primary'
                }`}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <Typography className="text-white" variant="button">
                  {confirmText}
                </Typography>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default BottomAlert;

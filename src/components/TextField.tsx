import React, { forwardRef, useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/theme/colors';

import Typography from './Typography';

interface TextFieldProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  endIcon?: ImageSourcePropType;
  icon?: ImageSourcePropType;
  rightIcon?: React.ReactNode;
  onPressRightIcon?: () => void;
  error?: string;
}

const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      label,
      placeholder = '',
      className = '',
      endIcon,
      icon,
      rightIcon,
      onPressRightIcon,
      error,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error;

    const containerStyles = `
      flex-row items-center px-4 h-14 border rounded-xl bg-white
      ${hasError ? 'border-red-500' : isFocused ? 'border-primary' : 'border-borderColor'}
      ${className}
    `;

    return (
      <View className="w-full mb-4">
        {label && (
          <Typography className="text-secondary mb-2 ml-1" variant="bodySmallSemiBold">
            {label}
          </Typography>
        )}
        <View className={containerStyles}>
          {icon && <Image className="w-5 h-5 mr-3" resizeMode="contain" source={icon} />}
          <TextInput
            ref={ref}
            autoComplete="off"
            autoCorrect={false}
            className="flex-1 h-10 text-black text-base font-sans-regular"
            placeholder={placeholder}
            placeholderTextColor={Colors.textSecondary}
            underlineColorAndroid="transparent"
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            {...rest}
          />
          {rightIcon && (
            <TouchableOpacity disabled={!onPressRightIcon} onPress={onPressRightIcon}>
              <View className="ml-2">{rightIcon}</View>
            </TouchableOpacity>
          )}
          {endIcon && (
            <View>
              <Image className="w-6 h-6 ml-2" resizeMode="contain" source={endIcon} />
            </View>
          )}
        </View>
        {error && (
          <Text className="text-red-500 text-xs mt-1.5 ml-1 font-sans-regular">{error}</Text>
        )}
      </View>
    );
  },
);

export default TextField;

import React, { forwardRef, useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

interface TextFieldProps extends TextInputProps {
  placeholder?: string;
  className?: string;
  endIcon?: ImageSourcePropType;
  icon?: ImageSourcePropType;
  hasError?: boolean;
}

const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      placeholder = '',
      className = '',
      endIcon,
      icon,
      hasError = false,
      style,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const containerStyles = `
      flex-row items-center px-4 h-14 border rounded-xl my-2 bg-gray-50
      ${hasError ? 'border-red-500' : isFocused ? 'border-black' : 'border-gray-300'}
      ${className}
    `;

    return (
      <View className={containerStyles}>
        {icon && <Image source={icon} className="w-5 h-5 mr-3" resizeMode="contain" />}
        <TextInput
          ref={ref}
          autoComplete="off"
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          className="flex-1 h-10 text-black text-base font-semibold"
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
        {endIcon && (
          <View>
            <Image source={endIcon} className="w-6 h-6 ml-2" resizeMode="contain" />
          </View>
        )}
      </View>
    );
  },
);

export default TextField;

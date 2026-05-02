import React, { type FC, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text,
  View,
} from 'react-native';

type ButtonTypes = 'primary' | 'secondary' | 'outline' | 'disabled';

interface ButtonProps extends PressableProps {
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
  title: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type?: ButtonTypes;
}

const Button: FC<ButtonProps> = ({
  className = '',
  textClassName = '',
  isLoading = false,
  title,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'primary',
  ...rest
}) => {
  const isButtonDisabled = disabled || isLoading || type === 'disabled';

  const baseStyles = "w-full rounded-3xl items-center justify-center py-4 mb-6";
  
  const typeStyles = {
    primary: "bg-black",
    secondary: "bg-gray-200",
    outline: "bg-transparent border border-black",
    disabled: "bg-gray-400",
  };

  const textStyles = {
    primary: "text-white",
    secondary: "text-black",
    outline: "text-black",
    disabled: "text-gray-200",
  };

  return (
    <Pressable
      disabled={isButtonDisabled}
      className={`${baseStyles} ${typeStyles[type]} ${isButtonDisabled ? 'opacity-50' : 'active:opacity-70'} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={type === 'primary' ? "#ffffff" : "#000000"} size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          {leftIcon && <View className="mx-2">{leftIcon}</View>}
          <Text className={`text-base font-semibold text-center ${textStyles[type]} ${textClassName}`}>
            {title}
          </Text>
          {rightIcon && <View className="mx-2">{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
};

export default Button;

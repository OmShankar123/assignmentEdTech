import React, { type FC, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps, Text, View } from 'react-native';

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

  const baseStyles = 'w-full h-14 rounded-xl items-center justify-center mb-4';

  const typeStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-transparent border border-primary',
    disabled: 'bg-gray-300',
  };

  const textStyles = {
    primary: 'text-white font-sans-bold',
    secondary: 'text-white font-sans-bold',
    outline: 'text-primary font-sans-bold',
    disabled: 'text-gray-500 font-sans-bold',
  };

  return (
    <Pressable
      className={`${baseStyles} ${typeStyles[type]} ${isButtonDisabled ? 'opacity-50' : 'active:opacity-80'} ${className}`}
      disabled={isButtonDisabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={type === 'primary' ? '#ffffff' : '#0a7ea4'} size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          {leftIcon && <View className="mx-2">{leftIcon}</View>}
          <Text className={`text-base text-center ${textStyles[type]} ${textClassName}`}>
            {title}
          </Text>
          {rightIcon && <View className="mx-2">{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
};

export default Button;

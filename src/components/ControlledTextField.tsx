import React from 'react';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Text, View, type TextInputProps } from 'react-native';
import TextField from './TextField';

interface ControlledTextFieldProps<T extends FieldValues> extends Omit<
  TextInputProps,
  'value' | 'onChangeText'
> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  className?: string;
}

export function ControlledTextField<T extends FieldValues>({
  control,
  name,
  className,
  ...rest
}: ControlledTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="w-full">
          <TextField
            className={className}
            hasError={!!error}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            {...rest}
          />
          {error?.message && (
            <Text className="text-red-500 text-xs mt-1 ml-1 mb-2">
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}

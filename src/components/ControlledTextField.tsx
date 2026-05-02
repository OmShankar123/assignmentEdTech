import React from 'react';
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import { type TextInputProps } from 'react-native';

import TextField from './TextField';

interface Props<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}

export const ControlledTextField = <T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <TextField
          error={error?.message}
          label={label}
          value={value}
          onBlur={onBlur}
          onChangeText={onChange}
          {...rest}
        />
      )}
    />
  );
};

import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';

import Env from '@env';
import Button from '@/components/Button';
import { ControlledTextField } from '@/components/ControlledTextField';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useUserStore } from '@/store/useUserStore';

const loginSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email'),

  password: z
    .string({ error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const login = useUserStore((state) => state.login);
  const router = useRouter();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login({ email: data.email });
  };

  return (
    <ScreenWrapper className="flex-1 p-5 justify-center items-center">
      <Text className="text-3xl font-bold mb-5">Login</Text>
      
      <View className="w-full mb-5">
        <ControlledTextField<LoginFormData>
          autoCapitalize="none"
          autoComplete="email"
          control={control}
          keyboardType="email-address"
          name="email"
          placeholder="Enter your email"
          returnKeyType="next"
          className="mb-4"
        />

        <ControlledTextField<LoginFormData>
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          control={control}
          name="password"
          placeholder="Enter your password"
          returnKeyType="done"
          className="mb-4"
        />
      </View>

      <Button
        title="Sign in"
        onPress={handleSubmit(onSubmit)}
        className="w-full"
      />

      <View className="mt-5 items-center">
        <Text className="text-gray-500">Don't have an account?</Text>
        <Button 
          title="Register" 
          type="outline" 
          onPress={() => router.push('/(auth)/register')}
          className="mt-2"
        />
      </View>

      {__DEV__ && (
        <Text className="text-red-500 mt-5 font-semibold">
          {`Environment : ${Env.EXPO_PUBLIC_APP_ENV}`}
        </Text>
      )}
    </ScreenWrapper>
  );
}

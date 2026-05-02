import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { z } from 'zod';

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
    <ScreenWrapper className="flex-1 px-6 justify-center">
      <Animated.View entering={FadeInDown.duration(800)}>
        <Text className="text-4xl font-sans-bold text-black mb-2">Welcome Back</Text>
        <Text className="text-base font-sans-regular text-secondary mb-10">
          Sign in to continue your learning journey.
        </Text>
      </Animated.View>

      <View className="w-full">
        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <ControlledTextField<LoginFormData>
            autoCapitalize="none"
            autoComplete="email"
            control={control}
            keyboardType="email-address"
            label="Email Address"
            name="email"
            placeholder="e.g. hello@example.com"
            returnKeyType="next"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <ControlledTextField<LoginFormData>
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            control={control}
            label="Password"
            name="password"
            placeholder="********"
            returnKeyType="done"
          />
        </Animated.View>

        <Animated.View className="items-end mb-8" entering={FadeInDown.delay(500).duration(800)}>
          <TouchableOpacity onPress={() => console.log('Forgot Password')}>
            <Text className="text-primary font-sans-semibold text-sm">Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(600).duration(800)}>
        <Button className="shadow-lg" title="Sign In" onPress={handleSubmit(onSubmit)} />
      </Animated.View>

      <Animated.View
        className="mt-8 flex-row justify-center"
        entering={FadeInDown.delay(800).duration(800)}
      >
        <Text className="text-secondary font-sans-regular">Don&apos;t have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text className="text-primary font-sans-bold">Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScreenWrapper>
  );
}

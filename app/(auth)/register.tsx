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

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log(data);
    router.back();
  };

  return (
    <ScreenWrapper className="flex-1 px-6 justify-center">
      <Animated.View entering={FadeInDown.duration(800)}>
        <Text className="text-4xl font-sans-bold text-black mb-2">Create Account</Text>
        <Text className="text-base font-sans-regular text-secondary mb-10">
          Join us and start your learning journey today.
        </Text>
      </Animated.View>

      <View className="w-full">
        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <ControlledTextField<RegisterFormData>
            control={control}
            label="Full Name"
            name="name"
            placeholder="e.g. John Doe"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <ControlledTextField<RegisterFormData>
            control={control}
            label="Email Address"
            name="email"
            placeholder="e.g. hello@example.com"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(800)}>
          <ControlledTextField<RegisterFormData>
            secureTextEntry
            control={control}
            label="Password"
            name="password"
            placeholder="********"
          />
        </Animated.View>
      </View>

      <Animated.View className="mt-4" entering={FadeInDown.delay(800).duration(800)}>
        <Button className="shadow-lg" title="Create Account" onPress={handleSubmit(onSubmit)} />

        <TouchableOpacity className="mt-6 flex-row justify-center" onPress={() => router.back()}>
          <Text className="text-secondary font-sans-regular">Already have an account? </Text>
          <Text className="text-primary font-sans-bold">Sign In</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScreenWrapper>
  );
}

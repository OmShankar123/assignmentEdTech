import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';

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
    <ScreenWrapper className="flex-1 p-5 justify-center">
      <Text className="text-3xl font-bold mb-5 text-center">Register</Text>
      
      <View className="w-full mb-5">
        <ControlledTextField<RegisterFormData>
          control={control}
          name="name"
          placeholder="Full Name"
          className="mb-4"
        />
        <ControlledTextField<RegisterFormData>
          control={control}
          name="email"
          placeholder="Email"
          className="mb-4"
        />
        <ControlledTextField<RegisterFormData>
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
          className="mb-4"
        />
      </View>

      <Button title="Create Account" onPress={handleSubmit(onSubmit)} className="w-full" />
      
      <Button 
        title="Back to Login" 
        type="outline" 
        onPress={() => router.back()} 
        className="mt-4 w-full" 
      />
    </ScreenWrapper>
  );
}

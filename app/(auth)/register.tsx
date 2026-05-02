import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';

import { type RegisterFormData, registerSchema } from '@/api/auth/schemas';
import { useRegister } from '@/api/auth/use-register';
import Button from '@/components/Button';
import { ControlledTextField } from '@/components/ControlledTextField';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typography from '@/components/Typography';

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: registerMutation, isPending } = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation(
      {
        ...data,
        role: 'USER',
      },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: t('auth.register_success'),
            text2: t('auth.register_success_msg'),
          });
          router.back();
        },
      },
    );
  };

  return (
    <ScreenWrapper scrollable showBackgroundShape={true}>
      <Header title={t('auth.create_account')} />

      <View className="flex-1 justify-between pb-10 pt-5">
        <View>
          <Animated.View entering={FadeInDown.duration(800).damping(12)}>
            <Typography className="text-text text-left mb-2" variant="h1">
              {t('auth.sign_up')}
            </Typography>
            <Typography className="text-secondary text-left mb-8" variant="body">
              {t('auth.join_us')}
            </Typography>
          </Animated.View>

          <View className="gap-y-4">
            <Animated.View entering={FadeInDown.delay(100).duration(800).damping(12)}>
              <ControlledTextField<RegisterFormData>
                control={control}
                label={t('auth.username')}
                name="username"
                placeholder={t('auth.username_placeholder')}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(800).damping(12)}>
              <ControlledTextField<RegisterFormData>
                autoCapitalize="none"
                control={control}
                keyboardType="email-address"
                label={t('auth.email')}
                name="email"
                placeholder={t('auth.email_placeholder')}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(800).damping(12)}>
              <ControlledTextField<RegisterFormData>
                secureTextEntry
                control={control}
                label={t('auth.password')}
                name="password"
                placeholder="********"
              />
            </Animated.View>

            <Animated.View
              className="mt-8"
              entering={FadeInDown.delay(400).duration(800).damping(12)}
            >
              <Button
                isLoading={isPending}
                title={t('auth.create_account')}
                onPress={handleSubmit(onSubmit)}
              />
            </Animated.View>
          </View>
        </View>

        <Animated.View
          className="mt-8 flex-row justify-center"
          entering={FadeInDown.delay(500).duration(800).damping(12)}
        >
          <Typography className="text-secondary" variant="bodySmall">
            {t('auth.already_have_account')}{' '}
          </Typography>
          <TouchableOpacity onPress={() => router.back()}>
            <Typography className="text-primary" variant="bodySmallSemiBold">
              {t('auth.sign_in')}
            </Typography>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}

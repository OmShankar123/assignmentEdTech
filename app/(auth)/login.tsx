import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';

import { type LoginFormData, loginSchema } from '@/api/auth/schemas';
import { useLogin } from '@/api/auth/use-login';
import Button from '@/components/Button';
import { ControlledTextField } from '@/components/ControlledTextField';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typography from '@/components/Typography';
import { setTokens } from '@/storage/token';
import { useUserStore } from '@/store/useUserStore';
import { Colors } from '@/theme/colors';

export default function Login() {
  const { t } = useTranslation();
  const loginStore = useUserStore((state) => state.login);
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { mutate: loginMutation, isPending } = useLogin();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation(data, {
      onSuccess: async (response) => {
        const { user, accessToken, refreshToken } = response.data;
        await setTokens(accessToken, refreshToken);
        loginStore(user);
        Toast.show({
          type: 'success',
          text1: t('auth.login_success'),
          text2: t('auth.login_success_msg', { username: user.username }),
        });
      },
    });
  };

  return (
    <ScreenWrapper scrollable showBackgroundShape={true}>
      <Header showBackButton={false} />

      <View className="flex-1 justify-between pb-10 pt-5">
        <View>
          <Animated.View entering={FadeInDown.duration(800).damping(12)}>
            <Typography className="text-black text-left mb-2" variant="h1">
              {t('auth.sign_in')}
            </Typography>
            <Typography className="text-secondary text-left mb-8" variant="body">
              {t('auth.welcome_back')}
            </Typography>
          </Animated.View>

          <View className="gap-y-4">
            <Animated.View entering={FadeInDown.delay(100).duration(800).damping(12)}>
              <ControlledTextField<LoginFormData>
                autoCapitalize="none"
                control={control}
                label={t('auth.username')}
                name="username"
                placeholder="e.g. johndoe"
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(800).damping(12)}>
              <ControlledTextField<LoginFormData>
                control={control}
                label={t('auth.password')}
                name="password"
                placeholder="********"
                rightIcon={
                  <Ionicons
                    color={Colors.textSecondary}
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    size={20}
                  />
                }
                secureTextEntry={!isPasswordVisible}
                onPressRightIcon={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            </Animated.View>

            <Animated.View
              className="mt-8"
              entering={FadeInDown.delay(400).duration(800).damping(12)}
            >
              <Button
                isLoading={isPending}
                title={t('auth.sign_in')}
                onPress={handleSubmit(onSubmit)}
              />
            </Animated.View>
          </View>
        </View>

        <Animated.View
          className="mt-8 flex-row justify-center"
          entering={FadeInDown.delay(700).duration(800).damping(12)}
        >
          <Typography className="text-secondary" variant="bodySmall">
            {t('auth.dont_have_account')}{' '}
          </Typography>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Typography className="text-primary" variant="bodySmallSemiBold">
              {t('auth.sign_up')}
            </Typography>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}

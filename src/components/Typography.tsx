import React from 'react';
import { Text, type TextProps } from 'react-native';

import { TextStyles } from '@/theme';

type Variant = keyof typeof TextStyles;

interface TypographyProps extends TextProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  className = '',
  children,
  style,
  ...rest
}) => {
  return (
    <Text className={className} style={[TextStyles[variant], style]} {...rest}>
      {children}
    </Text>
  );
};

export default Typography;

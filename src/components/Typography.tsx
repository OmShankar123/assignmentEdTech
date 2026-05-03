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
  // Auto-determine colors based on theme if not explicitly overridden in className
  const hasColorClass = className.includes('text-');

  // Revert to stable Light Mode colors
  const baseColorClass = 'text-black';
  const secondaryColorClass = 'text-secondary';

  // Variants that typically use secondary/muted colors
  const isSecondaryVariant = ['caption', 'bodySmall'].includes(variant);
  const defaultColorClass = !hasColorClass
    ? isSecondaryVariant
      ? secondaryColorClass
      : baseColorClass
    : '';

  return (
    <Text
      className={`${defaultColorClass} ${className}`}
      style={[TextStyles[variant], style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default Typography;

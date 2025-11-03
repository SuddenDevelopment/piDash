import { styled } from '@gluestack-style/react';
import { Text as RNText } from 'react-native';

export const Text = styled(RNText, {
  color: '$text',
  fontSize: '$md',
  fontFamily: 'System',
});

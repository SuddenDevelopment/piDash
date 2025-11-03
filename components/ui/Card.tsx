import { styled } from '@gluestack-style/react';
import { View } from 'react-native';

export const Card = styled(View, {
  backgroundColor: '$backgroundLight',
  borderRadius: '$lg',
  padding: '$4',
  borderWidth: 1,
  borderColor: '$border',
});

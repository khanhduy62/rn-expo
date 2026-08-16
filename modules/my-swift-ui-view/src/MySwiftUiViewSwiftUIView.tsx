import { requireNativeView } from 'expo';
import { type CommonViewModifierProps } from '@expo/ui/swift-ui';
import { createViewModifierEventListener } from '@expo/ui/swift-ui/modifiers';
import * as React from 'react';

export interface MySwiftUiViewSwiftUIViewProps extends CommonViewModifierProps {
  title: string;
  onTap?: () => void;
  children?: React.ReactNode;
}

const NativeMySwiftUiViewSwiftUIView = requireNativeView<MySwiftUiViewSwiftUIViewProps>(
  'MySwiftUiView',
  'MySwiftUiViewSwiftUIView'
);

export default function MySwiftUiViewSwiftUIView({
  modifiers,
  ...rest
}: MySwiftUiViewSwiftUIViewProps) {
  return (
    <NativeMySwiftUiViewSwiftUIView
      modifiers={modifiers}
      {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
      {...rest}
    />
  );
}

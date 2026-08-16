import { createModifier, type ModifierConfig } from '@expo/ui/swift-ui/modifiers';

export const mySwiftUiViewSwiftUIModifier = (params: {
  color?: string;
  width?: number;
  cornerRadius?: number;
}): ModifierConfig => createModifier('mySwiftUiViewSwiftUIModifier', params);

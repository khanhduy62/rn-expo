import MyHapticsModule from './src/MyHapticsModule';
import type { HapticStyle } from './src/MyHaptics.types';

export { default } from './src/MyHapticsModule';
export * from './src/MyHaptics.types';

export const PI = MyHapticsModule.PI;

export function hello(): string {
  return MyHapticsModule.hello();
}

export async function setValueAsync(value: string): Promise<void> {
  return await MyHapticsModule.setValueAsync(value);
}

export async function triggerHaptic(style: HapticStyle = 'light'): Promise<void> {
  return await MyHapticsModule.triggerHaptic(style);
}

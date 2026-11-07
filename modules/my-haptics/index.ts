import MyHapticsModule from './src/MyHapticsModule';

export { default } from './src/MyHapticsModule';
export * from './src/MyHaptics.types';

export const PI = MyHapticsModule.PI;

export function hello(): string {
  return MyHapticsModule.hello();
}

export async function setValueAsync(value: string): Promise<void> {
  return await MyHapticsModule.setValueAsync(value);
}

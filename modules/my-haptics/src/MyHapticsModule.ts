import { NativeModule, requireNativeModule } from 'expo';

import { MyHapticsModuleEvents } from './MyHaptics.types';

declare class MyHapticsModule extends NativeModule<MyHapticsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

export default requireNativeModule<MyHapticsModule>('MyHaptics');

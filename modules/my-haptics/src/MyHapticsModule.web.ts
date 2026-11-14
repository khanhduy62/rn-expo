import { registerWebModule, NativeModule } from 'expo';

import { MyHapticsModuleEvents } from './MyHaptics.types';

// MyHapticsModule is not available on the web platform.
class MyHapticsModule extends NativeModule<MyHapticsModuleEvents> {}

export default registerWebModule(MyHapticsModule, 'MyHapticsModule');

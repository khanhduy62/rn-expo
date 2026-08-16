import { NativeModule, requireNativeModule } from 'expo';

declare class MySwiftUiViewModule extends NativeModule<{}> {}

export default requireNativeModule<MySwiftUiViewModule>('MySwiftUiView');

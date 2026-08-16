import { registerWebModule, NativeModule } from 'expo';

// MySwiftUiViewModule is not available on the web platform.
class MySwiftUiViewModule extends NativeModule<{}> {}

export default registerWebModule(MySwiftUiViewModule, 'MySwiftUiViewModule');

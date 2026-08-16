import ExpoModulesCore
import ExpoUI

public class MySwiftUiViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MySwiftUiView")

    ExpoUIView(MySwiftUiViewSwiftUIView.self)

    OnCreate {
      ViewModifierRegistry.register("mySwiftUiViewSwiftUIModifier") { params, appContext, _ in
        return try MySwiftUiViewSwiftUIModifier(from: params, appContext: appContext)
      }
    }

    OnDestroy {
      ViewModifierRegistry.unregister("mySwiftUiViewSwiftUIModifier")
    }
  }
}

import ExpoModulesCore

public class MyHapticsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyHaptics")

    Events("onChange")

    Constant("PI") {
      Double.pi
    }

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }
  }
}

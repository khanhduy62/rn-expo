import ExpoModulesCore
import UIKit

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

    AsyncFunction("triggerHaptic") { (style: String) in
      DispatchQueue.main.async {
        let generator: UIImpactFeedbackGenerator

        switch style.lowercased() {
        case "light":
            generator = UIImpactFeedbackGenerator(style: .light)
        case "medium":
            generator = UIImpactFeedbackGenerator(style: .medium)
        case "heavy":
            generator = UIImpactFeedbackGenerator(style: .heavy)
        default:
            generator = UIImpactFeedbackGenerator(style: .medium)
        }

        generator.prepare()
        generator.impactOccurred()
      }
    }
  }
}

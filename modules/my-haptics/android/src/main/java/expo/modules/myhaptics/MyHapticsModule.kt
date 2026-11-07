package expo.modules.myhaptics

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MyHapticsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyHaptics")

    Events("onChange")

    Constant("PI") {
      Math.PI
    }

    Function("hello") {
      "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { value: String ->
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }
  }
}

import SwiftUI
import ExpoModulesCore
import ExpoUI

final class MySwiftUiViewSwiftUIViewProps: UIBaseViewProps {
  @Field var title: String = ""
}

struct MySwiftUiViewSwiftUIView: ExpoSwiftUI.View {
  @ObservedObject public var props: MySwiftUiViewSwiftUIViewProps

  var body: some View {
    VStack {
      Text(props.title)
        .font(.headline)
      Children()
    }
  }
}

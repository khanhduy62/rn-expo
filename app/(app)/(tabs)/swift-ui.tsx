import MySwiftUiViewSwiftUIView from "@/modules/my-swift-ui-view/src/MySwiftUiViewSwiftUIView";
import { Host } from "@expo/ui/swift-ui";

export default function LoadingView() {
  return (
    <Host style={{ flex: 1 }}>
      <MySwiftUiViewSwiftUIView
        title="Hello from SwiftUI!"
        onTap={() => {
          alert("SwiftUI view tapped!");
        }}
      ></MySwiftUiViewSwiftUIView>
    </Host>
  );
}

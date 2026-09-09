import { mySwiftUiViewSwiftUIModifier } from "@/modules/my-swift-ui-view/src/MySwiftUiViewSwiftUIModifier";
import MySwiftUiViewSwiftUIView from "@/modules/my-swift-ui-view/src/MySwiftUiViewSwiftUIView";
import { Host } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";

export default function SwiftUiScreen() {
  return (
    <Host style={{ flex: 1 }}>
      <MySwiftUiViewSwiftUIView
        title="Hello from SwiftUI!"
        modifiers={[
          padding({
            all: 20,
          }),
          mySwiftUiViewSwiftUIModifier({
            color: "green",
            width: 1,
            cornerRadius: 10,
          }),
        ]}
        onTap={() => {
          alert("SwiftUI view tapped!");
        }}
      />
    </Host>
  );
}

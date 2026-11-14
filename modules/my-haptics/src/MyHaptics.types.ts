export type MyHapticsModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type HapticStyle = "light" | "medium" | "heavy";

// export interface CwbHapticsModule {
//   triggerHaptic(style: HapticStyle): Promise<void>;
// }
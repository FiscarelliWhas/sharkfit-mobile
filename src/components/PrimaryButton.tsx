import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

export function PrimaryButton({
  children,
  onPress,
  variant = "primary",
  style
}: {
  children: ReactNode;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "ghost" && styles.ghost,
        variant === "danger" && styles.danger,
        pressed && styles.pressed,
        style
      ]}
    >
      <Text style={[styles.text, variant === "ghost" && styles.ghostText]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.aqua,
    paddingHorizontal: 14
  },
  ghost: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: colors.border
  },
  danger: {
    backgroundColor: colors.danger
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }]
  },
  text: {
    color: colors.black,
    fontWeight: "900",
    fontSize: 14,
    textAlign: "center"
  },
  ghostText: {
    color: colors.text
  }
});

import { StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";

export function ProgressBar({ value, color = colors.aqua }: { value: number; color?: string }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 9,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.10)"
  },
  fill: {
    height: "100%",
    borderRadius: 999
  }
});

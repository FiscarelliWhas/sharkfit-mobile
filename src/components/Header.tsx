import Animated, { FadeInDown } from "react-native-reanimated";
import { StyleSheet, Text, View } from "react-native";
import { useApp } from "../state/AppContext";
import { colors } from "../theme/colors";
import { SharkMascot } from "./SharkMascot";

export function Header({ title, subtitle, compact = false }: { title: string; subtitle?: string; compact?: boolean }) {
  const { state } = useApp();
  return (
    <Animated.View entering={FadeInDown.duration(420)} style={styles.wrap}>
      <View style={{ flex: 1 }}>
        <Text style={styles.kicker}>{state.profile.appTitle}</Text>
        <Text style={[styles.title, compact && styles.compact]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <SharkMascot size={compact ? 74 : 92} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  kicker: {
    color: colors.aqua,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    marginTop: 4
  },
  compact: {
    fontSize: 24,
    lineHeight: 30
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20
  }
});

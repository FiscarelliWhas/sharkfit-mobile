import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.25,
  shadowRadius: 18,
  elevation: 6
};

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 18,
    paddingBottom: 112,
    gap: 16
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600"
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  }
});

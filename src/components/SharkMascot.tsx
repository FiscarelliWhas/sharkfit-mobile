import { Image, StyleSheet, View } from "react-native";

export function SharkMascot({ size = 118 }: { size?: number }) {
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image source={require("../../assets/shark-logo.png")} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "#05080D"
  },
  image: {
    width: "100%",
    height: "100%"
  }
});

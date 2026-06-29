import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { dayNames, dayOrder } from "../data/constants";
import { useApp } from "../state/AppContext";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/layout";

export function RoutineScreen() {
  const { state } = useApp();

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.content}>
      <Header compact title="Rotina semanal" subtitle="Tudo aqui pode ser editado em Ajustes." />
      {dayOrder.map((day) => (
        <Card key={day}>
          <Text style={sharedStyles.sectionTitle}>{dayNames[day]}</Text>
          <View style={styles.timeline}>
            {(state.routine[day] ?? []).map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.time}>{item.time}</Text>
                <View style={styles.dot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.detail}>{item.detail}</Text>
                </View>
              </View>
            ))}
            {!state.routine[day]?.length ? <Text style={styles.detail}>Nenhum item cadastrado.</Text> : null}
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  timeline: { marginTop: 12, gap: 14 },
  item: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  time: { color: colors.aqua, width: 50, fontWeight: "900" },
  dot: { width: 9, height: 9, borderRadius: 99, backgroundColor: colors.aqua, marginTop: 4 },
  title: { color: colors.text, fontWeight: "900", fontSize: 15 },
  detail: { color: colors.muted, marginTop: 3, lineHeight: 18 }
});

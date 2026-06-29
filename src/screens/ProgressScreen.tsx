import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { useApp } from "../state/AppContext";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/layout";
import { humanDate } from "../utils/date";
import { percent } from "../utils/progress";

export function ProgressScreen() {
  const { state, addWeight } = useApp();
  const [weight, setWeight] = useState(String(state.currentWeight));
  const [note, setNote] = useState("");
  const startWeight = state.profile.startWeight || state.currentWeight;
  const lost = Number((startWeight - state.currentWeight).toFixed(1));
  const remaining = Number((state.currentWeight - state.goalWeight).toFixed(1));
  const progress = percent(startWeight - state.currentWeight, startWeight - state.goalWeight);

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.content}>
      <Header compact title="Progresso" subtitle="Pesagem, historico e conquistas editaveis." />
      <Card>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.label}>Peso atual</Text>
            <Text style={styles.big}>{state.currentWeight}kg</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>Meta</Text>
            <Text style={styles.big}>{state.goalWeight}kg</Text>
          </View>
        </View>
        <ProgressBar value={progress} color={colors.success} />
        <View style={styles.heroRow}>
          <Text style={styles.metric}>Perdido: {Math.max(0, lost)}kg</Text>
          <Text style={styles.metric}>Faltam: {Math.max(0, remaining)}kg</Text>
        </View>
      </Card>

      <Card>
        <Text style={sharedStyles.sectionTitle}>⚖️ Registrar pesagem</Text>
        <Input keyboardType="decimal-pad" value={weight} onChangeText={setWeight} placeholder="Peso" style={{ marginTop: 12 }} />
        <Input value={note} onChangeText={setNote} placeholder="Observacao" style={{ marginTop: 10 }} />
        <PrimaryButton
          onPress={() => {
            const next = Number(weight.replace(",", "."));
            if (Number.isFinite(next) && next > 0) {
              addWeight(next, note);
              setNote("");
            }
          }}
          style={{ marginTop: 12 }}
        >
          Salvar pesagem
        </PrimaryButton>
      </Card>

      <Card>
        <Text style={sharedStyles.sectionTitle}>🏆 Conquistas</Text>
        <View style={styles.badges}>
          {state.achievements.map((item) => {
            const unlocked = state.streak >= item.days;
            return (
              <View key={item.id} style={[styles.badge, unlocked && styles.badgeOn]}>
                <Text style={styles.badgeIcon}>{item.icon}</Text>
                <Text style={[styles.badgeText, unlocked && styles.badgeTextOn]}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={sharedStyles.sectionTitle}>Historico</Text>
        {state.weights.map((entry) => (
          <View key={entry.id} style={styles.history}>
            <Text style={styles.historyWeight}>{entry.weight}kg</Text>
            <Text style={styles.historyDate}>{humanDate(entry.date)}</Text>
            <Text style={styles.historyNote}>{entry.note || "Sem observacao"}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heroRow: { flexDirection: "row", justifyContent: "space-between", gap: 16, marginBottom: 12, marginTop: 12 },
  label: { color: colors.muted, fontWeight: "800" },
  big: { color: colors.text, fontWeight: "900", fontSize: 30, marginTop: 4 },
  metric: { color: colors.aqua, fontWeight: "900", marginTop: 12 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  badge: { width: "31%", alignItems: "center", padding: 12, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.06)" },
  badgeOn: { backgroundColor: "rgba(84,224,166,0.16)", borderColor: colors.success, borderWidth: 1 },
  badgeIcon: { fontSize: 24 },
  badgeText: { color: colors.muted, fontWeight: "800", marginTop: 6 },
  badgeTextOn: { color: colors.text },
  history: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 },
  historyWeight: { color: colors.text, fontWeight: "900", fontSize: 17 },
  historyDate: { color: colors.aqua, fontWeight: "800", marginTop: 2 },
  historyNote: { color: colors.muted, marginTop: 4 }
});

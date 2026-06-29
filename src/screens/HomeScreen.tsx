import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { useApp } from "../state/AppContext";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/layout";
import { weekdayKey } from "../utils/date";
import { dayCompletion, percent } from "../utils/progress";

const checklist = [
  ["breakfast", "Cafe da manha"],
  ["lunch", "Almoco"],
  ["snack", "Lanche"],
  ["dinner", "Jantar"],
  ["water", "Agua"],
  ["workout", "Treino"]
] as const;

export function HomeScreen() {
  const { state, todayLog, toggleChecklist, addWater, consumeRecipe, scheduleNotifications } = useApp();
  const day = weekdayKey();
  const todayRoutine = state.routine[day] ?? [];
  const hasWorkout = todayRoutine.some((item) => item.type === "workout");
  const nextMeal = todayRoutine.find((item) => item.type === "meal") ?? todayRoutine[0];
  const nextWorkout = todayRoutine.find((item) => item.type === "workout");
  const recipeOfDay = state.recipes.length ? state.recipes[(new Date().getDate() - 1) % state.recipes.length] : undefined;
  const completion = dayCompletion(todayLog, hasWorkout);
  const motivation = state.motivations[new Date().getDate() % Math.max(1, state.motivations.length)] ?? "Continue.";
  const waterPct = percent(todayLog.waterMl, state.waterGoalMl);
  const activeAchievement = state.achievements.filter((item) => state.streak >= item.days).at(-1);

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.content}>
      <Header title={state.profile.slogan} subtitle={motivation} />

      <Animated.View entering={FadeInUp.delay(80).duration(420)} style={styles.statsGrid}>
        <Card style={styles.stat}><Text style={styles.statIcon}>🔥</Text><Text style={styles.statValue}>{state.streak}</Text><Text style={styles.statLabel}>sequencia</Text></Card>
        <Card style={styles.stat}><Text style={styles.statIcon}>⚖️</Text><Text style={styles.statValue}>{state.currentWeight}kg</Text><Text style={styles.statLabel}>peso atual</Text></Card>
        <Card style={styles.stat}><Text style={styles.statIcon}>🎯</Text><Text style={styles.statValue}>{state.goalWeight}kg</Text><Text style={styles.statLabel}>meta</Text></Card>
        <Card style={styles.stat}><Text style={styles.statIcon}>💧</Text><Text style={styles.statValue}>{(todayLog.waterMl / 1000).toFixed(1)}L</Text><Text style={styles.statLabel}>agua hoje</Text></Card>
      </Animated.View>

      <Card>
        <View style={styles.cardHead}>
          <Text style={sharedStyles.sectionTitle}>📅 Dia em curso</Text>
          <Text style={styles.percent}>{completion}%</Text>
        </View>
        <ProgressBar value={completion} color={colors.success} />
        {completion === 100 ? <Text style={styles.win}>{state.completionMessage}</Text> : null}
      </Card>

      <Card>
        <Text style={sharedStyles.sectionTitle}>Checklist diario</Text>
        <View style={styles.checkGrid}>
          {checklist
            .filter(([key]) => key !== "workout" || hasWorkout)
            .map(([key, label]) => {
              const done = todayLog.checklist[key];
              return (
                <PrimaryButton key={key} variant={done ? "primary" : "ghost"} onPress={() => toggleChecklist(key, hasWorkout)} style={styles.checkButton}>
                  {done ? "☑ " : "☐ "}{label}
                </PrimaryButton>
              );
            })}
        </View>
      </Card>

      <Card>
        <View style={styles.cardHead}>
          <Text style={sharedStyles.sectionTitle}>💧 Hidratacao</Text>
          <Text style={styles.percent}>{state.waterGoalMl - todayLog.waterMl > 0 ? `${state.waterGoalMl - todayLog.waterMl}ml faltam` : "meta batida"}</Text>
        </View>
        <ProgressBar value={waterPct} />
        <View style={styles.waterButtons}>
          {[250, 500, 750, 1000].map((amount) => (
            <PrimaryButton key={amount} variant="ghost" onPress={() => addWater(amount, hasWorkout)} style={styles.waterButton}>+{amount}ml</PrimaryButton>
          ))}
        </View>
      </Card>

      <View style={styles.twoCards}>
        <Card style={styles.flexCard}>
          <Text style={styles.miniLabel}>🍽 Proxima refeicao</Text>
          <Text style={styles.nextTitle}>{nextMeal ? `${nextMeal.time} ${nextMeal.title}` : "Livre"}</Text>
          <Text style={styles.nextDetail}>{nextMeal?.detail ?? "Ajuste sua rotina em Ajustes."}</Text>
        </Card>
        <Card style={styles.flexCard}>
          <Text style={styles.miniLabel}>🏋 Proximo treino</Text>
          <Text style={styles.nextTitle}>{nextWorkout ? `${nextWorkout.time} ${nextWorkout.title}` : "Livre"}</Text>
          <Text style={styles.nextDetail}>{nextWorkout?.detail ?? "Sem treino obrigatorio hoje."}</Text>
        </Card>
      </View>

      <Card>
        <Text style={sharedStyles.sectionTitle}>🍳 Receita do dia</Text>
        {recipeOfDay ? (
          <>
            <Text style={styles.recipeTitle}>{recipeOfDay.name}</Text>
            <Text style={styles.body}>{recipeOfDay.ingredientText}</Text>
            <Text style={styles.body}>{recipeOfDay.instructions}</Text>
            <PrimaryButton onPress={() => consumeRecipe(recipeOfDay.id, hasWorkout)} style={{ marginTop: 12 }}>Marcar receita consumida</PrimaryButton>
          </>
        ) : (
          <Text style={styles.body}>Crie uma receita para aparecer aqui.</Text>
        )}
      </Card>

      <Card>
        <Text style={sharedStyles.sectionTitle}>🏆 Conquista ativa</Text>
        <Text style={styles.achievement}>{activeAchievement ? `${activeAchievement.icon} ${activeAchievement.label}` : "Continue ate a primeira conquista"}</Text>
        <PrimaryButton variant={state.notificationsScheduled ? "ghost" : "primary"} onPress={scheduleNotifications} style={{ marginTop: 12 }}>
          {state.notificationsScheduled ? "Notificacoes ativadas" : "Ativar notificacoes"}
        </PrimaryButton>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  stat: { width: "48%", minHeight: 112, justifyContent: "center" },
  statIcon: { fontSize: 22 },
  statValue: { color: colors.text, fontSize: 24, fontWeight: "900", marginTop: 6 },
  statLabel: { color: colors.muted, marginTop: 2, fontSize: 12, fontWeight: "700" },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10 },
  percent: { color: colors.aqua, fontWeight: "900" },
  win: { color: colors.success, fontWeight: "900", marginTop: 12 },
  checkGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  checkButton: { width: "48%" },
  waterButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  waterButton: { width: "48%" },
  twoCards: { flexDirection: "row", gap: 10 },
  flexCard: { flex: 1 },
  miniLabel: { color: colors.aqua, fontWeight: "900", marginBottom: 8 },
  nextTitle: { color: colors.text, fontWeight: "900", fontSize: 16, lineHeight: 21 },
  nextDetail: { color: colors.muted, marginTop: 8, lineHeight: 18 },
  recipeTitle: { color: colors.text, fontWeight: "900", fontSize: 18, marginTop: 12 },
  body: { color: colors.muted, lineHeight: 20, marginTop: 8 },
  achievement: { color: colors.text, fontSize: 20, fontWeight: "900", marginTop: 12 }
});

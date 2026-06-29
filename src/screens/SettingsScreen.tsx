import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { dayNames, dayOrder } from "../data/constants";
import { useApp } from "../state/AppContext";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/layout";
import { Achievement, DayKey, Reminder, RoutineItem, RoutineType, StockItem, UserProfile } from "../types";
import { createId } from "../utils/date";

const routineTypes: { value: RoutineType; label: string }[] = [
  { value: "meal", label: "Refeicao" },
  { value: "workout", label: "Treino" },
  { value: "free", label: "Livre" }
];

function toNumber(value: string, fallback: number) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function blankStock(): StockItem {
  return { id: createId("estoque"), name: "", quantity: 1, initialQuantity: 1, unit: "un", group: "Geral", marketDefault: 1 };
}

function blankRoutine(day: DayKey): RoutineItem {
  return { id: createId(`rotina-${day}`), time: "08:00", title: "", detail: "", type: "meal" };
}

function blankReminder(): Reminder {
  return { id: createId("lembrete"), enabled: true, frequency: "daily", hour: 8, minute: 0, title: "", body: "" };
}

function blankAchievement(): Achievement {
  return { id: createId("conquista"), days: 1, icon: "🏆", label: "" };
}

export function SettingsScreen() {
  const {
    state,
    updateProfile,
    updateMotivations,
    updateCompletionMessage,
    saveRoutineItem,
    deleteRoutineItem,
    saveStockItem,
    deleteStockItem,
    saveReminder,
    deleteReminder,
    saveAchievement,
    deleteAchievement
  } = useApp();

  const [profile, setProfile] = useState<UserProfile>(state.profile);
  const [motivationText, setMotivationText] = useState(state.motivations.join("\n"));
  const [completionMessage, setCompletionMessage] = useState(state.completionMessage);
  const [selectedDay, setSelectedDay] = useState<DayKey>("monday");
  const [stockEdit, setStockEdit] = useState<StockItem | null>(null);
  const [routineEdit, setRoutineEdit] = useState<RoutineItem | null>(null);
  const [reminderEdit, setReminderEdit] = useState<Reminder | null>(null);
  const [achievementEdit, setAchievementEdit] = useState<Achievement | null>(null);

  function saveProfile() {
    updateProfile({
      ...profile,
      currentWeight: Number(profile.currentWeight),
      goalWeight: Number(profile.goalWeight),
      startWeight: Number(profile.startWeight),
      height: Number(profile.height),
      waterGoalMl: Number(profile.waterGoalMl)
    });
  }

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.content}>
      <Header compact title="Ajustes" subtitle="Personalize o app para qualquer pessoa usar." />

      <Card>
        <Text style={sharedStyles.sectionTitle}>Perfil e metas</Text>
        <Input value={profile.name} onChangeText={(name) => setProfile({ ...profile, name })} placeholder="Nome" style={styles.input} />
        <Input value={profile.appTitle} onChangeText={(appTitle) => setProfile({ ...profile, appTitle })} placeholder="Nome do app" style={styles.input} />
        <Input value={profile.slogan} onChangeText={(slogan) => setProfile({ ...profile, slogan })} placeholder="Slogan" style={styles.input} />
        <View style={styles.grid}>
          <Input keyboardType="decimal-pad" value={String(profile.currentWeight)} onChangeText={(value) => setProfile({ ...profile, currentWeight: toNumber(value, profile.currentWeight) })} placeholder="Peso atual" style={styles.halfInput} />
          <Input keyboardType="decimal-pad" value={String(profile.goalWeight)} onChangeText={(value) => setProfile({ ...profile, goalWeight: toNumber(value, profile.goalWeight) })} placeholder="Meta" style={styles.halfInput} />
          <Input keyboardType="decimal-pad" value={String(profile.startWeight)} onChangeText={(value) => setProfile({ ...profile, startWeight: toNumber(value, profile.startWeight) })} placeholder="Peso inicial" style={styles.halfInput} />
          <Input keyboardType="decimal-pad" value={String(profile.height)} onChangeText={(value) => setProfile({ ...profile, height: toNumber(value, profile.height) })} placeholder="Altura" style={styles.halfInput} />
        </View>
        <Input keyboardType="number-pad" value={String(profile.waterGoalMl)} onChangeText={(value) => setProfile({ ...profile, waterGoalMl: toNumber(value, profile.waterGoalMl) })} placeholder="Meta de agua em ml" style={styles.input} />
        <Input value={profile.preferences} onChangeText={(preferences) => setProfile({ ...profile, preferences })} placeholder="Preferencias, restricoes e equipamentos" multiline style={styles.input} />
        <PrimaryButton onPress={saveProfile} style={styles.top}>Salvar perfil</PrimaryButton>
      </Card>

      <Card>
        <Text style={sharedStyles.sectionTitle}>Frases e mensagem final</Text>
        <Input value={motivationText} onChangeText={setMotivationText} placeholder="Uma frase por linha" multiline style={styles.inputTall} />
        <Input value={completionMessage} onChangeText={setCompletionMessage} placeholder="Mensagem ao concluir o dia" style={styles.input} />
        <PrimaryButton
          onPress={() => {
            updateMotivations(motivationText.split("\n"));
            updateCompletionMessage(completionMessage);
          }}
          style={styles.top}
        >
          Salvar frases
        </PrimaryButton>
      </Card>

      <Card>
        <View style={styles.headRow}>
          <Text style={sharedStyles.sectionTitle}>Estoque</Text>
          <PrimaryButton onPress={() => setStockEdit(blankStock())} style={styles.smallButton}>Novo</PrimaryButton>
        </View>
        {state.stock.map((item) => (
          <View key={item.id} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.quantity}{item.unit} · {item.group} · compra {item.marketDefault}{item.unit}</Text>
            </View>
            <PrimaryButton variant="ghost" onPress={() => setStockEdit(item)} style={styles.iconButton}>Editar</PrimaryButton>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.headRow}>
          <Text style={sharedStyles.sectionTitle}>Rotina</Text>
          <PrimaryButton onPress={() => setRoutineEdit(blankRoutine(selectedDay))} style={styles.smallButton}>Novo</PrimaryButton>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {dayOrder.map((day) => (
            <Pressable key={day} onPress={() => setSelectedDay(day)} style={[styles.filter, selectedDay === day && styles.filterOn]}>
              <Text style={[styles.filterText, selectedDay === day && styles.filterTextOn]}>{dayNames[day]}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {(state.routine[selectedDay] ?? []).map((item) => (
          <View key={item.id} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.time} · {item.title}</Text>
              <Text style={styles.itemMeta}>{item.type} · {item.detail}</Text>
            </View>
            <PrimaryButton variant="ghost" onPress={() => setRoutineEdit(item)} style={styles.iconButton}>Editar</PrimaryButton>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.headRow}>
          <Text style={sharedStyles.sectionTitle}>Lembretes</Text>
          <PrimaryButton onPress={() => setReminderEdit(blankReminder())} style={styles.smallButton}>Novo</PrimaryButton>
        </View>
        {state.reminders.map((item) => (
          <View key={item.id} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.enabled ? "Ativo" : "Pausado"} · {item.title}</Text>
              <Text style={styles.itemMeta}>{item.frequency === "daily" ? "Diario" : dayNames[item.day ?? "monday"]} · {String(item.hour).padStart(2, "0")}:{String(item.minute).padStart(2, "0")}</Text>
            </View>
            <PrimaryButton variant="ghost" onPress={() => setReminderEdit(item)} style={styles.iconButton}>Editar</PrimaryButton>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.headRow}>
          <Text style={sharedStyles.sectionTitle}>Conquistas</Text>
          <PrimaryButton onPress={() => setAchievementEdit(blankAchievement())} style={styles.smallButton}>Novo</PrimaryButton>
        </View>
        {state.achievements.map((item) => (
          <View key={item.id} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.icon} {item.label}</Text>
              <Text style={styles.itemMeta}>{item.days} dias de sequencia</Text>
            </View>
            <PrimaryButton variant="ghost" onPress={() => setAchievementEdit(item)} style={styles.iconButton}>Editar</PrimaryButton>
          </View>
        ))}
      </Card>

      <StockModal item={stockEdit} onClose={() => setStockEdit(null)} onSave={saveStockItem} onDelete={deleteStockItem} />
      <RoutineModal day={selectedDay} item={routineEdit} onClose={() => setRoutineEdit(null)} onSave={saveRoutineItem} onDelete={deleteRoutineItem} />
      <ReminderModal item={reminderEdit} onClose={() => setReminderEdit(null)} onSave={saveReminder} onDelete={deleteReminder} />
      <AchievementModal item={achievementEdit} onClose={() => setAchievementEdit(null)} onSave={saveAchievement} onDelete={deleteAchievement} />
    </ScrollView>
  );
}

function StockModal({ item, onClose, onSave, onDelete }: { item: StockItem | null; onClose: () => void; onSave: (item: StockItem) => void; onDelete: (id: string) => void }) {
  const [draft, setDraft] = useState<StockItem | null>(item);
  if (item && draft?.id !== item.id) setDraft(item);
  return (
    <EditModal visible={!!item} title="Item do estoque" onClose={onClose}>
      {draft ? (
        <>
          <Input value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} placeholder="Nome" style={styles.input} />
          <View style={styles.grid}>
            <Input value={String(draft.quantity)} keyboardType="decimal-pad" onChangeText={(value) => setDraft({ ...draft, quantity: toNumber(value, draft.quantity) })} placeholder="Qtd" style={styles.halfInput} />
            <Input value={draft.unit} onChangeText={(unit) => setDraft({ ...draft, unit })} placeholder="Unidade" style={styles.halfInput} />
            <Input value={String(draft.initialQuantity)} keyboardType="decimal-pad" onChangeText={(value) => setDraft({ ...draft, initialQuantity: toNumber(value, draft.initialQuantity) })} placeholder="Qtd inicial" style={styles.halfInput} />
            <Input value={String(draft.marketDefault)} keyboardType="decimal-pad" onChangeText={(value) => setDraft({ ...draft, marketDefault: toNumber(value, draft.marketDefault) })} placeholder="Compra padrao" style={styles.halfInput} />
          </View>
          <Input value={draft.group} onChangeText={(group) => setDraft({ ...draft, group })} placeholder="Grupo" style={styles.input} />
          <PrimaryButton onPress={() => { onSave(draft); onClose(); }}>Salvar</PrimaryButton>
          <PrimaryButton variant="danger" onPress={() => { onDelete(draft.id); onClose(); }}>Excluir</PrimaryButton>
        </>
      ) : null}
    </EditModal>
  );
}

function RoutineModal({ day, item, onClose, onSave, onDelete }: { day: DayKey; item: RoutineItem | null; onClose: () => void; onSave: (day: DayKey, item: RoutineItem) => void; onDelete: (day: DayKey, id: string) => void }) {
  const [draft, setDraft] = useState<RoutineItem | null>(item);
  if (item && draft?.id !== item.id) setDraft(item);
  return (
    <EditModal visible={!!item} title={`Rotina · ${dayNames[day]}`} onClose={onClose}>
      {draft ? (
        <>
          <Input value={draft.time} onChangeText={(time) => setDraft({ ...draft, time })} placeholder="Horario 08:00" style={styles.input} />
          <Input value={draft.title} onChangeText={(title) => setDraft({ ...draft, title })} placeholder="Titulo" style={styles.input} />
          <Input value={draft.detail} onChangeText={(detail) => setDraft({ ...draft, detail })} placeholder="Detalhe" multiline style={styles.input} />
          <View style={styles.filters}>
            {routineTypes.map((type) => (
              <Pressable key={type.value} onPress={() => setDraft({ ...draft, type: type.value })} style={[styles.filter, draft.type === type.value && styles.filterOn]}>
                <Text style={[styles.filterText, draft.type === type.value && styles.filterTextOn]}>{type.label}</Text>
              </Pressable>
            ))}
          </View>
          <PrimaryButton onPress={() => { onSave(day, draft); onClose(); }}>Salvar</PrimaryButton>
          <PrimaryButton variant="danger" onPress={() => { onDelete(day, draft.id); onClose(); }}>Excluir</PrimaryButton>
        </>
      ) : null}
    </EditModal>
  );
}

function ReminderModal({ item, onClose, onSave, onDelete }: { item: Reminder | null; onClose: () => void; onSave: (item: Reminder) => void; onDelete: (id: string) => void }) {
  const [draft, setDraft] = useState<Reminder | null>(item);
  if (item && draft?.id !== item.id) setDraft(item);
  return (
    <EditModal visible={!!item} title="Lembrete" onClose={onClose}>
      {draft ? (
        <>
          <Input value={draft.title} onChangeText={(title) => setDraft({ ...draft, title })} placeholder="Titulo" style={styles.input} />
          <Input value={draft.body} onChangeText={(body) => setDraft({ ...draft, body })} placeholder="Mensagem" multiline style={styles.input} />
          <View style={styles.grid}>
            <Input value={String(draft.hour)} keyboardType="number-pad" onChangeText={(value) => setDraft({ ...draft, hour: toNumber(value, draft.hour) })} placeholder="Hora" style={styles.halfInput} />
            <Input value={String(draft.minute)} keyboardType="number-pad" onChangeText={(value) => setDraft({ ...draft, minute: toNumber(value, draft.minute) })} placeholder="Min" style={styles.halfInput} />
          </View>
          <View style={styles.filters}>
            <Pressable onPress={() => setDraft({ ...draft, enabled: !draft.enabled })} style={[styles.filter, draft.enabled && styles.filterOn]}>
              <Text style={[styles.filterText, draft.enabled && styles.filterTextOn]}>{draft.enabled ? "Ativo" : "Pausado"}</Text>
            </Pressable>
            <Pressable onPress={() => setDraft({ ...draft, frequency: draft.frequency === "daily" ? "weekly" : "daily" })} style={styles.filter}>
              <Text style={styles.filterText}>{draft.frequency === "daily" ? "Diario" : "Semanal"}</Text>
            </Pressable>
          </View>
          {draft.frequency === "weekly" ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {dayOrder.map((day) => (
                <Pressable key={day} onPress={() => setDraft({ ...draft, day })} style={[styles.filter, draft.day === day && styles.filterOn]}>
                  <Text style={[styles.filterText, draft.day === day && styles.filterTextOn]}>{dayNames[day]}</Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
          <PrimaryButton onPress={() => { onSave(draft); onClose(); }}>Salvar</PrimaryButton>
          <PrimaryButton variant="danger" onPress={() => { onDelete(draft.id); onClose(); }}>Excluir</PrimaryButton>
        </>
      ) : null}
    </EditModal>
  );
}

function AchievementModal({ item, onClose, onSave, onDelete }: { item: Achievement | null; onClose: () => void; onSave: (item: Achievement) => void; onDelete: (id: string) => void }) {
  const [draft, setDraft] = useState<Achievement | null>(item);
  if (item && draft?.id !== item.id) setDraft(item);
  return (
    <EditModal visible={!!item} title="Conquista" onClose={onClose}>
      {draft ? (
        <>
          <Input value={draft.icon} onChangeText={(icon) => setDraft({ ...draft, icon })} placeholder="Icone" style={styles.input} />
          <Input value={draft.label} onChangeText={(label) => setDraft({ ...draft, label })} placeholder="Nome" style={styles.input} />
          <Input value={String(draft.days)} keyboardType="number-pad" onChangeText={(value) => setDraft({ ...draft, days: toNumber(value, draft.days) })} placeholder="Dias" style={styles.input} />
          <PrimaryButton onPress={() => { onSave(draft); onClose(); }}>Salvar</PrimaryButton>
          <PrimaryButton variant="danger" onPress={() => { onDelete(draft.id); onClose(); }}>Excluir</PrimaryButton>
        </>
      ) : null}
    </EditModal>
  );
}

function EditModal({ visible, title, children, onClose }: { visible: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modal}>
          <ScrollView contentContainerStyle={{ gap: 10 }}>
            <Text style={sharedStyles.sectionTitle}>{title}</Text>
            {children}
            <PrimaryButton variant="ghost" onPress={onClose}>Cancelar</PrimaryButton>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: { marginTop: 10 },
  inputTall: { marginTop: 10, minHeight: 120, textAlignVertical: "top" },
  top: { marginTop: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  halfInput: { width: "48%" },
  headRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  smallButton: { width: 92, minHeight: 38 },
  iconButton: { width: 82, minHeight: 38 },
  listRow: { flexDirection: "row", gap: 10, alignItems: "center", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 },
  itemTitle: { color: colors.text, fontWeight: "900", fontSize: 15 },
  itemMeta: { color: colors.muted, marginTop: 4, lineHeight: 18 },
  filters: { flexDirection: "row", gap: 8, paddingVertical: 10, flexWrap: "wrap" },
  filter: { paddingHorizontal: 12, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: colors.border },
  filterOn: { backgroundColor: colors.aqua, borderColor: colors.aqua },
  filterText: { color: colors.text, fontWeight: "800" },
  filterTextOn: { color: colors.black },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.62)" },
  modal: { maxHeight: "88%", backgroundColor: colors.backgroundAlt, borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border }
});

import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { useApp } from "../state/AppContext";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/layout";
import { Recipe, RecipeCategory } from "../types";
import { createId, weekdayKey } from "../utils/date";

const filters = ["Todas", "Favoritas", "Cafe da manha", "Almoco", "Lanche", "Jantar"] as const;
const categories: RecipeCategory[] = ["Cafe da manha", "Almoco", "Lanche", "Jantar", "Livre"];

function blankRecipe(): Recipe {
  return {
    id: createId("receita"),
    name: "",
    category: "Livre",
    ingredients: [],
    ingredientText: "",
    instructions: "",
    prepTime: "",
    notes: "",
    favorite: false,
    consumedCount: 0
  };
}

export function RecipesScreen() {
  const { state, saveRecipe, deleteRecipe, duplicateRecipe, toggleFavorite, consumeRecipe } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const [editing, setEditing] = useState<Recipe | null>(null);
  const hasWorkout = (state.routine[weekdayKey()] ?? []).some((item) => item.type === "workout");

  const recipes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return state.recipes.filter((recipe) => {
      const matchesFilter = filter === "Todas" || (filter === "Favoritas" ? recipe.favorite : recipe.category === filter);
      const haystack = `${recipe.name} ${recipe.ingredientText} ${recipe.category}`.toLowerCase();
      return matchesFilter && (!needle || haystack.includes(needle));
    });
  }, [state.recipes, query, filter]);

  async function pickPhoto() {
    if (!editing) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) {
      setEditing({ ...editing, photoUri: result.assets[0].uri });
    }
  }

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.content}>
      <Header compact title="📖 Receitas" subtitle="Crie, favorite, duplique e consuma receitas com baixa automatica no estoque." />
      <Input value={query} onChangeText={setQuery} placeholder="Buscar por nome, ingrediente ou categoria" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterOn]}>
            <Text style={[styles.filterText, filter === item && styles.filterTextOn]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <PrimaryButton onPress={() => setEditing(blankRecipe())}>➕ Criar receita</PrimaryButton>

      {recipes.map((recipe) => (
        <Card key={recipe.id}>
          <View style={styles.recipeHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.category}>{recipe.category}</Text>
              <Text style={styles.title}>{recipe.favorite ? "★ " : ""}{recipe.name}</Text>
              <Text style={styles.meta}>{recipe.prepTime || "Tempo livre"} · consumida {recipe.consumedCount}x</Text>
            </View>
            {recipe.photoUri ? <Image source={{ uri: recipe.photoUri }} style={styles.thumb} /> : null}
          </View>
          <Text style={styles.body}>{recipe.ingredientText}</Text>
          <Text style={styles.body}>{recipe.instructions}</Text>
          {recipe.notes ? <Text style={styles.note}>{recipe.notes}</Text> : null}
          <View style={styles.actions}>
            <PrimaryButton variant="ghost" onPress={() => toggleFavorite(recipe.id)} style={styles.action}>{recipe.favorite ? "★" : "☆"}</PrimaryButton>
            <PrimaryButton variant="ghost" onPress={() => setEditing(recipe)} style={styles.action}>Editar</PrimaryButton>
            <PrimaryButton variant="ghost" onPress={() => duplicateRecipe(recipe.id)} style={styles.action}>Duplicar</PrimaryButton>
          </View>
          <View style={styles.actions}>
            <PrimaryButton onPress={() => consumeRecipe(recipe.id, hasWorkout)} style={styles.actionWide}>Consumir</PrimaryButton>
            <PrimaryButton variant="danger" onPress={() => deleteRecipe(recipe.id)} style={styles.actionWide}>Excluir</PrimaryButton>
          </View>
        </Card>
      ))}

      <Modal visible={!!editing} animationType="slide" transparent onRequestClose={() => setEditing(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <ScrollView contentContainerStyle={{ gap: 10 }}>
              <Text style={sharedStyles.sectionTitle}>Receita</Text>
              <Input value={editing?.name} onChangeText={(name) => editing && setEditing({ ...editing, name })} placeholder="Nome" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                {categories.map((category) => (
                  <Pressable key={category} onPress={() => editing && setEditing({ ...editing, category })} style={[styles.filter, editing?.category === category && styles.filterOn]}>
                    <Text style={[styles.filterText, editing?.category === category && styles.filterTextOn]}>{category}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Input value={editing?.ingredientText} onChangeText={(ingredientText) => editing && setEditing({ ...editing, ingredientText })} placeholder="Ingredientes" multiline />
              <Input value={editing?.instructions} onChangeText={(instructions) => editing && setEditing({ ...editing, instructions })} placeholder="Modo de preparo" multiline />
              <Input value={editing?.prepTime} onChangeText={(prepTime) => editing && setEditing({ ...editing, prepTime })} placeholder="Tempo de preparo" />
              <Input value={editing?.notes} onChangeText={(notes) => editing && setEditing({ ...editing, notes })} placeholder="Observacoes" multiline />
              <PrimaryButton variant="ghost" onPress={pickPhoto}>Foto opcional</PrimaryButton>
              <PrimaryButton
                onPress={() => {
                  if (editing?.name.trim()) {
                    saveRecipe(editing);
                    setEditing(null);
                  }
                }}
              >
                Salvar
              </PrimaryButton>
              <PrimaryButton variant="ghost" onPress={() => setEditing(null)}>Cancelar</PrimaryButton>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: { gap: 8, paddingVertical: 2 },
  filter: { paddingHorizontal: 12, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: colors.border },
  filterOn: { backgroundColor: colors.aqua, borderColor: colors.aqua },
  filterText: { color: colors.text, fontWeight: "800" },
  filterTextOn: { color: colors.black },
  recipeHead: { flexDirection: "row", gap: 12 },
  category: { color: colors.aqua, fontWeight: "900", fontSize: 12 },
  title: { color: colors.text, fontWeight: "900", fontSize: 19, marginTop: 4 },
  meta: { color: colors.muted, marginTop: 4, fontWeight: "700" },
  thumb: { width: 68, height: 68, borderRadius: 8 },
  body: { color: colors.muted, lineHeight: 20, marginTop: 10 },
  note: { color: colors.warning, lineHeight: 19, marginTop: 10, fontWeight: "800" },
  actions: { flexDirection: "row", gap: 8, marginTop: 12 },
  action: { flex: 1 },
  actionWide: { flex: 1 },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.62)" },
  modal: { maxHeight: "88%", backgroundColor: colors.backgroundAlt, borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border }
});

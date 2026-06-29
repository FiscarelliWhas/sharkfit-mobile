import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { useApp } from "../state/AppContext";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/layout";
import { shoppingItems } from "../utils/progress";

export function StockScreen() {
  const { state, toggleMarketItem, completeMarket } = useApp();
  const items = shoppingItems(state.stock);
  const groups = Array.from(new Set(items.map((item) => item.group)));
  const lowCount = items.filter((item) => item.low).length;

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.content}>
      <Header compact title="Estoque e compras" subtitle="Lista inteligente, estoque baixo e modo mercado com atualização automática." />
      <Card>
        <Text style={sharedStyles.sectionTitle}>🛒 Planejador de compras</Text>
        <Text style={styles.body}>{lowCount ? `⚠️ ${lowCount} item(ns) abaixo de 30% foram adicionados à lista.` : "Estoque semanal sob controle."}</Text>
        <Text style={styles.reminder}>Seg 18:00 frutas e legumes · Ter 18:00 frutas e verduras · Qua 18:00 proteínas · Sáb 09:00 revisão</Text>
      </Card>

      {groups.map((group) => (
        <Card key={group}>
          <Text style={sharedStyles.sectionTitle}>{group}</Text>
          {items.filter((item) => item.group === group).map((item) => (
            <View key={item.id} style={styles.stockRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.stockHead}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={item.low ? styles.low : styles.qty}>{item.quantity}{item.unit}</Text>
                </View>
                <ProgressBar value={item.percent} color={item.low ? colors.warning : colors.aqua} />
                {item.low ? <Text style={styles.lowText}>⚠️ Estoque baixo</Text> : null}
              </View>
            </View>
          ))}
        </Card>
      ))}

      <Card>
        <Text style={sharedStyles.sectionTitle}>Modo mercado</Text>
        {items.map((item) => {
          const checked = !!state.marketChecked[item.id] || item.low;
          return (
            <PrimaryButton key={item.id} variant={checked ? "primary" : "ghost"} onPress={() => toggleMarketItem(item.id)} style={styles.marketButton}>
              {checked ? "☑ " : "☐ "}{item.name}
            </PrimaryButton>
          );
        })}
        <PrimaryButton onPress={completeMarket} style={{ marginTop: 12 }}>Concluir compra e atualizar estoque</PrimaryButton>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { color: colors.text, fontWeight: "800", marginTop: 12, lineHeight: 20 },
  reminder: { color: colors.muted, marginTop: 10, lineHeight: 19 },
  stockRow: { marginTop: 14 },
  stockHead: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 8 },
  itemName: { color: colors.text, fontWeight: "900", fontSize: 15 },
  qty: { color: colors.aqua, fontWeight: "900" },
  low: { color: colors.warning, fontWeight: "900" },
  lowText: { color: colors.warning, fontWeight: "800", marginTop: 6 },
  marketButton: { marginTop: 8 }
});

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import { ProgressScreen } from "../screens/ProgressScreen";
import { RecipesScreen } from "../screens/RecipesScreen";
import { RoutineScreen } from "../screens/RoutineScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { StockScreen } from "../screens/StockScreen";
import { colors } from "../theme/colors";

export type RootTabParamList = {
  Hoje: undefined;
  Rotina: undefined;
  Receitas: undefined;
  Estoque: undefined;
  Progresso: undefined;
  Ajustes: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const icons: Record<keyof RootTabParamList, string> = {
  Hoje: "🦈",
  Rotina: "📅",
  Receitas: "🍳",
  Estoque: "🛒",
  Progresso: "🏆",
  Ajustes: "⚙️"
};

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: colors.black,
          borderTopColor: colors.border,
          height: 76,
          paddingTop: 8,
          paddingBottom: 10
        },
        tabBarActiveTintColor: colors.aqua,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "800" },
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>{icons[route.name]}</Text>
      })}
    >
      <Tab.Screen name="Hoje" component={HomeScreen} />
      <Tab.Screen name="Rotina" component={RoutineScreen} />
      <Tab.Screen name="Receitas" component={RecipesScreen} />
      <Tab.Screen name="Estoque" component={StockScreen} />
      <Tab.Screen name="Progresso" component={ProgressScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

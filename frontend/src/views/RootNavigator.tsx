import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationProp } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { AuthView } from "./auth/AuthView";
import { Theme } from "~/theme/theme";
import { MainNavigator } from "./main/MainNavigator";
import { useBoundStore } from "~/services/store/store";

export function RootNavigator() {
  const theme = useTheme<Theme>();
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Main" : "Authentication"}
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen name="Authentication" component={AuthView} />
    </Stack.Navigator>
  );
}

type RootParamsList = {
  Main: undefined;
  Authentication: undefined;
};

const Stack = createNativeStackNavigator<RootParamsList>();

export type RootNavigation = NavigationProp<RootParamsList>;

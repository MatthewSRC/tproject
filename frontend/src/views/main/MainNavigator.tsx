import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { LanguageSelectModal } from "./home/modals/LanguageSelectModal";
import { Home } from "./home/Home";
import { PermissionRequestModal } from "./home/modals/PermissionRequestModal";
import { History } from "./history/History";

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="History" component={History} />
      <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
        <Stack.Screen name="LanguageModal" component={LanguageSelectModal} />
        <Stack.Screen
          name="PermissionRequestModal"
          component={PermissionRequestModal}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

type MainParamsList = {
  Home: undefined;
  History: undefined;
  LanguageModal: { type: SelectionType };
  PermissionRequestModal: undefined;
};

const Stack = createNativeStackNavigator<MainParamsList>();

export type MainNavigation = NavigationProp<MainParamsList>;
export type LanguageModalRoute = RouteProp<MainParamsList, "LanguageModal">;

import { ThemeProvider } from "@shopify/restyle";
import { StatusBar } from "expo-status-bar";
import { theme } from "~/theme/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "~/views/RootNavigator";
import useCachedResources from "hooks/useCachedResources";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <StatusBar style="auto" />
            <RootNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

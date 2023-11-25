import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useBoundStore } from "~/services/store/store";
import { setupDatabase } from "~/services/database/bridge";

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const setAuthenticated = useBoundStore((state) => state.setAuthenticated);

  /* Load any resources or data that we need prior to rendering the app */
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      console.log("Loading resources...");
      SplashScreen.preventAutoHideAsync();

      await Font.loadAsync({
        InterBlack: require("~assets/fonts/Inter-Black.ttf"),
        InterBold: require("~assets/fonts/Inter-Bold.ttf"),
        InterSemiBold: require("~assets/fonts/Inter-SemiBold.ttf"),
        InterMedium: require("~assets/fonts/Inter-Medium.ttf"),
        InterRegular: require("~assets/fonts/Inter-Regular.ttf"),
      });

      try {
        await GoogleSignin.signInSilently();
        const isSignedIn = await GoogleSignin.isSignedIn();
        setAuthenticated(isSignedIn);
      } catch (e) {
        setAuthenticated(false);
      }

      setupDatabase();

      setLoadingComplete(true);
      SplashScreen.hideAsync();
    }

    if (!isLoadingComplete) loadResourcesAndDataAsync();
  }, [isLoadingComplete]);

  return isLoadingComplete;
}

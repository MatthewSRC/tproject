import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { Box } from "~/components/Box";
import { SafeContainer } from "~/components/SafeContainer";
import { Text } from "~/components/Text";
import { height, width } from "~/theme/layout";
import { RootNavigation } from "../RootNavigator";
import Constants from "expo-constants";

export function AuthView() {
  const navigation = useNavigation<RootNavigation>();

  async function signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      navigation.navigate("Main");
    } catch (error) {
      // TODO Alert user of the error
    }
  }

  return (
    <SafeContainer padding={{ all: 16 }}>
      <Image
        style={{
          position: "absolute",
          top: height / 6,
          alignSelf: "center",
          width: width / 1.5 - 32,
          height: (width / 1.5 - 32) / 2,
        }}
        source={require("~assets/icon.png")}
      />
      <Box
        width={width}
        alignItems="center"
        position="absolute"
        bottom={16}
        gap="xs"
      >
        <Text variant="subtitle">To get started</Text>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
        <Box height={40} />
        <Text variant="subtitle" color="secondary" fontSize={14}>
          {Constants.expoConfig?.version}
        </Text>
      </Box>
    </SafeContainer>
  );
}

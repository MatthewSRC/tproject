import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import Modal from "react-native-modal/dist/modal";
import { MainNavigation } from "../../MainNavigator";
import { Box } from "~/components/Box";
import { Text } from "~/components/Text";
import { Pressable } from "react-native";
import { requestPermissionsAsync } from "expo-av/build/Audio";

export function PermissionRequestModal() {
  const navigation = useNavigation<MainNavigation>();
  const [visible, setVisible] = useState(true);

  async function handleRequest() {
    await requestPermissionsAsync();
    navigation.goBack();
  }

  return (
    <Modal
      style={{ margin: 16 }}
      isVisible={visible}
      swipeDirection={"down"}
      onBackdropPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      onModalHide={() => navigation.goBack()}
      propagateSwipe={true}
    >
      <Box
        padding="xl"
        width={"100%"}
        borderRadius={24}
        backgroundColor="background"
        alignItems="center"
        alignSelf="center"
        gap="l"
      >
        <Text variant="title">Permission request</Text>
        <Text variant="subtitle" textAlign="center" fontSize={14}>
          The app needs your consent to record the audio to translate.
        </Text>
        <Pressable style={{ width: "100%" }} onPress={handleRequest}>
          <Box
            width={"100%"}
            backgroundColor="primary"
            borderRadius={12}
            height={60}
            alignItems="center"
            justifyContent="center"
          >
            <Text variant="button">Give access</Text>
          </Box>
        </Pressable>
      </Box>
    </Modal>
  );
}

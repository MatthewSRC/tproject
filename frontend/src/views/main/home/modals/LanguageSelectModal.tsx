import { useState } from "react";
import Modal from "react-native-modal";
import { Box } from "~/components/Box";
import { Text } from "~/components/Text";
import {
  getStoredSourceLanguage,
  getStoredTargetLanguage,
  setStoredSourceLanguage,
  setStoredTargetLanguage,
} from "~/services/storage/storage";
import languages from "~/localization/languages.json";
import { ActivityIndicator, FlatList, Pressable } from "react-native";
import { LanguageItem } from "../components/LanguageItem";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LanguageModalRoute, MainNavigation } from "../../MainNavigator";
import { Theme } from "~/theme/theme";
import { useTheme } from "@shopify/restyle";

export function LanguageSelectModal() {
  const navigation = useNavigation<MainNavigation>();
  const { type } = useRoute<LanguageModalRoute>().params;
  const theme = useTheme<Theme>();
  const [visible, setVisible] = useState(true);
  const [currentlySelected, setCurrentlySelected] = useState(
    type === "SOURCE" ? getStoredSourceLanguage() : getStoredTargetLanguage()
  );
  const [hasAnimationFinished, setAnimationFinished] = useState(false);

  function handleSelectionSave() {
    switch (type) {
      case "SOURCE":
        setStoredSourceLanguage(currentlySelected);
        break;
      case "TARGET":
        setStoredTargetLanguage(currentlySelected);
        break;
      default:
        return;
    }
    navigation.goBack();
  }

  return (
    <Modal
      style={{ margin: 0 }}
      isVisible={visible}
      swipeDirection={"down"}
      onBackdropPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      onModalHide={() => navigation.goBack()}
      onModalShow={() => setAnimationFinished(true)}
      propagateSwipe={true}
    >
      <Box
        padding="m"
        paddingVertical="l"
        paddingTop="zero"
        position="absolute"
        width={"100%"}
        height={"70%"}
        bottom={0}
        borderTopLeftRadius={24}
        borderTopRightRadius={24}
        backgroundColor="background"
        gap="l"
      >
        <Box
          width={"50%"}
          alignSelf="center"
          height={10}
          borderBottomLeftRadius={12}
          borderBottomRightRadius={12}
          backgroundColor="primary"
        />
        <Text variant="title" textAlign="center">
          Languages
        </Text>
        <Text variant="subtitle" textAlign="center">
          {type === "SOURCE"
            ? "Originally spoken language"
            : "To translate to language"}
        </Text>
        {hasAnimationFinished ? (
          <FlatList
            data={languages}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            ListFooterComponent={<Box height={12} />}
            ListHeaderComponent={<Box height={12} />}
            ItemSeparatorComponent={() => <Box height={24} />}
            renderItem={({ item }) => (
              <Pressable onPress={() => setCurrentlySelected(item.code)}>
                <LanguageItem
                  code={item.code}
                  displayMode="FULL"
                  selected={currentlySelected === item.code}
                />
              </Pressable>
            )}
          />
        ) : (
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size={"large"} color={theme.colors.primary} />
          </Box>
        )}
        <Box width={"100%"} gap="m">
          <Pressable onPress={handleSelectionSave}>
            <Box
              width={"100%"}
              backgroundColor="primary"
              borderRadius={12}
              height={60}
              alignItems="center"
              justifyContent="center"
            >
              <Text variant="button">Save</Text>
            </Box>
          </Pressable>
          <Pressable onPress={() => setVisible(false)}>
            <Box
              width={"100%"}
              backgroundColor="background"
              borderWidth={4}
              borderColor="secondary"
              borderRadius={12}
              height={60}
              alignItems="center"
              justifyContent="center"
            >
              <Text variant="common">Cancel</Text>
            </Box>
          </Pressable>
        </Box>
      </Box>
    </Modal>
  );
}

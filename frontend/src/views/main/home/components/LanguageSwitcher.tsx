import { Box } from "~/components/Box";
import { Ionicons } from "@expo/vector-icons";
import { LanguageItem } from "./LanguageItem";
import { Pressable } from "react-native";
import { Text } from "~/components/Text";

export function LanguageSwitcher({
  sourceLanguage,
  targetLanguage,
  onSwitchPress,
  onPress,
}: Props) {
  return (
    <Box
      width={"100%"}
      justifyContent="space-evenly"
      alignItems="center"
      flexDirection="row"
    >
      <Pressable style={{ gap: 4 }} onPress={() => onPress("SOURCE")}>
        <Text variant="common" fontSize={14} textAlign="center">
          From
        </Text>
        <Box
          justifyContent="center"
          alignItems="center"
          width={68}
          height={68}
          borderRadius={16}
          backgroundColor="primary"
        >
          <LanguageItem code={sourceLanguage} displayMode="FLAG" />
        </Box>
      </Pressable>
      <Pressable onPress={onSwitchPress}>
        <Ionicons name="ios-repeat" size={60} color="black" />
      </Pressable>
      <Pressable style={{ gap: 4 }} onPress={() => onPress("TARGET")}>
        <Text variant="common" fontSize={14} textAlign="center">
          To
        </Text>
        <Box
          justifyContent="center"
          alignItems="center"
          width={68}
          height={68}
          borderRadius={16}
          backgroundColor="primary"
        >
          <LanguageItem code={targetLanguage} displayMode="FLAG" />
        </Box>
      </Pressable>
    </Box>
  );
}

interface Props {
  onPress: (type: SelectionType) => void;
  onSwitchPress: () => void;
  sourceLanguage: string;
  targetLanguage: string;
}

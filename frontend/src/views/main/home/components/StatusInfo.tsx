import { Box } from "~/components/Box";
import { Text } from "~/components/Text";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export function StatusInfo({ currentStatus }: Props) {
  switch (currentStatus) {
    case "WAITING":
      return (
        <Box gap="l" alignItems="center">
          <FontAwesome name="microphone" size={120} color="white" />
          <Text variant="common" color="textLight">
            Hold and speak
          </Text>
        </Box>
      );
    case "LISTENING":
      return (
        <Box gap="l" alignItems="center">
          <MaterialIcons name="multitrack-audio" size={120} color="white" />
          <Text variant="common" color="textLight">
            Listening
          </Text>
        </Box>
      );
    case "PROCESSING":
      return (
        <Box gap="l" alignItems="center">
          <FontAwesome name="cogs" size={120} color="white" />
          <Text variant="common" color="textLight">
            Processing
          </Text>
        </Box>
      );
    case "PLAYING":
      return (
        <Box gap="l" alignItems="center">
          <FontAwesome5 name="volume-up" size={120} color="white" />
          <Text variant="common" color="textLight">
            Reproducing
          </Text>
        </Box>
      );
    case "ERROR":
      return (
        <Box gap="l" alignItems="center">
          <FontAwesome5 name="volume-mute" size={120} color="white" />
          <Text
            variant="common"
            textAlign="center"
            fontSize={14}
            color="textLight"
          >
            There was an error{"\n"}press to dismiss
          </Text>
        </Box>
      );
    default:
      return null;
  }
}

interface Props {
  currentStatus: SpeechifyStatus;
}

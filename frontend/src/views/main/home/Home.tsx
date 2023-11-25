import { SafeContainer } from "~/components/SafeContainer";
import { RecordingBubble } from "./components/RecordingBubble";
import { Box } from "~/components/Box";
import { StatusInfo } from "./components/StatusInfo";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import {
  getSettings,
  getStoredSourceLanguage,
  getStoredTargetLanguage,
  setStoredSourceLanguage,
  setStoredTargetLanguage,
} from "~/services/storage/storage";
import { AVPlaybackStatusSuccess } from "expo-av";
import {
  Recording,
  RecordingOptionsPresets,
  Sound,
  getPermissionsAsync,
  setAudioModeAsync,
} from "expo-av/build/Audio";
import { speechify } from "~/services/speechify";
import { useNavigation } from "@react-navigation/native";
import { MainNavigation } from "../MainNavigator";
import { Pressable } from "react-native";
import { HomeHeader } from "./components/HomeHeader";
import { saveTranslatedAudio } from "~/services/database/bridge";

export function Home() {
  const navigation = useNavigation<MainNavigation>();
  const [recording, setRecording] = useState<Recording | undefined>();
  const [currentStatus, setCurrentStatus] =
    useState<SpeechifyStatus>("WAITING");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  useEffect(() => {
    navigation.addListener("focus", () => {
      setSourceLanguage(getStoredSourceLanguage());
      setTargetLanguage(getStoredTargetLanguage());
    });
    return navigation.removeListener("focus", () => {});
  });

  async function handlePressIn() {
    if (currentStatus === "ERROR") {
      setCurrentStatus("WAITING");
      return;
    }

    try {
      const hasPermissions = await getPermissionsAsync();

      if (!hasPermissions.granted) {
        navigation.navigate("PermissionRequestModal");
        return;
      }

      setCurrentStatus("LISTENING");

      await setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Recording.createAsync({
        ...RecordingOptionsPresets.HIGH_QUALITY,
        /*
        android: {
          extension: ".mp4",
          outputFormat: AndroidOutputFormat.MPEG_4,
          audioEncoder: AndroidAudioEncoder.AAC_ELD,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 16000,
        },
        */
      });
      setRecording(recording);
    } catch (e) {
      setCurrentStatus("ERROR");
      console.error(e);
      throw new Error("Failed to start recording");
    }
  }

  async function handlePressOut() {
    if (currentStatus === "WAITING") return;

    if (!recording) {
      console.log("No recording available");
      setCurrentStatus("ERROR");
      return;
    }

    try {
      setCurrentStatus("PROCESSING");

      await recording.stopAndUnloadAsync();
      await setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();

      if (!uri) {
        setCurrentStatus("ERROR");
        return;
      }

      const result = await speechify(uri, sourceLanguage, targetLanguage);

      if (!result) {
        setCurrentStatus("ERROR");
        return;
      }

      const sound = new Sound();
      await sound.loadAsync({ uri: result.uri });
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded) {
          const success = status as AVPlaybackStatusSuccess;
          if (success.didJustFinish) {
            await sound.unloadAsync();
            setRecording(undefined);
            const instantAudioDelete = getSettings().instantAudioDelete;

            if (instantAudioDelete) result.cleanUp();
            else
              await saveTranslatedAudio({
                uri: result.uri,
                durationSeconds: Math.ceil(
                  (success.durationMillis ?? 0) / 1000
                ),
                sourceLanguage,
                targetLanguage,
              });

            setCurrentStatus("WAITING");
          }
        }
      });
      setCurrentStatus("PLAYING");
    } catch (e) {
      setCurrentStatus("ERROR");
      throw e;
    }
  }

  function handleSwitcherPress(type: SelectionType) {
    navigation.navigate("LanguageModal", { type });
  }

  function handleSwitchPress() {
    setStoredSourceLanguage(targetLanguage);
    setStoredTargetLanguage(sourceLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceLanguage(targetLanguage);
  }

  return (
    <SafeContainer padding={{ all: 16 }}>
      <Box flex={1} justifyContent="space-between" alignItems="center">
        <HomeHeader />
        <Pressable
          style={{ flex: 1, width: "100%" }}
          disabled={currentStatus !== "WAITING" && currentStatus !== "ERROR"}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <RecordingBubble currentStatus={currentStatus} />
          <Box
            position="absolute"
            top={0}
            bottom={0}
            justifyContent="center"
            alignSelf="center"
          >
            <StatusInfo currentStatus={currentStatus} />
          </Box>
        </Pressable>
        <LanguageSwitcher
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onPress={handleSwitcherPress}
          onSwitchPress={handleSwitchPress}
        />
      </Box>
    </SafeContainer>
  );
}

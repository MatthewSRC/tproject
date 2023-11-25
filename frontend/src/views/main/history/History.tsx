import { Box } from "~/components/Box";
import { SafeContainer } from "~/components/SafeContainer";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MainNavigation } from "../MainNavigator";
import { Text } from "~/components/Text";
import { FontAwesome5 } from "@expo/vector-icons";
import { Switch } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "~/theme/theme";
import { useState } from "react";
import { getSettings, setSettings } from "~/services/storage/storage";
import { useInfiniteQuery } from "react-query";
import {
  clearTranslatedAudios,
  retrieveTranslatedAudios,
} from "~/services/database/bridge";
import { FontAwesome } from "@expo/vector-icons";
import { formatRelativeTime, formatSecondsToTime } from "~/services/converter";
import { LanguageItem } from "../home/components/LanguageItem";
import { Sound } from "expo-av/build/Audio";
import { AVPlaybackStatusSuccess } from "expo-av";

export function History() {
  const navigation = useNavigation<MainNavigation>();
  const theme = useTheme<Theme>();
  const [instantDelete, setInstantDelete] = useState(
    getSettings().instantAudioDelete
  );
  const [playing, setPlaying] = useState<
    { id: number; sound: Sound } | undefined
  >();
  const [remainingSeconds, setRemainingSeconds] = useState<
    number | undefined
  >();

  const audiosQuery = useInfiniteQuery({
    queryKey: ["audios"],
    queryFn: ({ pageParam }) =>
      retrieveTranslatedAudios({
        cursor: pageParam,
        sortDirection: "DESC",
      }),
    getNextPageParam: (lastPage) => lastPage.cursor,
    keepPreviousData: true,
  });

  if (audiosQuery.isLoading || !audiosQuery.data) {
    return (
      <SafeContainer>
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Box>
      </SafeContainer>
    );
  }

  const audios = audiosQuery.data.pages.flatMap((page) => page.data);

  function handleEndReached() {
    if (!audiosQuery.data) return;
    if (!audiosQuery.isFetching && audiosQuery.hasNextPage)
      audiosQuery.fetchNextPage();
  }

  function handleSwitch(value: boolean) {
    setInstantDelete(value);
    setSettings({ ...getSettings(), instantAudioDelete: value });
  }

  function handleTrashPress() {
    clearTranslatedAudios();
    navigation.goBack();
  }

  async function handleAudioPress(id: number) {
    if (playing && playing.id === id) {
      stopAudio(playing.sound);
      return;
    }

    if (playing && playing.id !== id) {
      stopAudio(playing.sound);
      playAudio(id);
      return;
    }
    playAudio(id);
  }

  async function stopAudio(sound: Sound) {
    setPlaying(undefined);
    setRemainingSeconds(undefined);
    await sound.stopAsync();
    await sound.unloadAsync();
  }

  async function playAudio(id: number) {
    const audio = audios.find((e) => e.id === id);

    if (!audio) return;

    const sound = new Sound();
    await sound.loadAsync({ uri: audio.uri });
    await sound.playAsync();
    setPlaying({ id, sound });
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded) {
        const success = status as AVPlaybackStatusSuccess;
        setRemainingSeconds(
          Math.max(
            0,
            audio.durationSeconds - Math.ceil(success.positionMillis / 1000)
          )
        );

        if (success.didJustFinish) {
          await sound.unloadAsync();
          setPlaying(undefined);
          setRemainingSeconds(undefined);
        }
      }
    });
  }

  return (
    <SafeContainer padding={{ all: 16 }}>
      <Box
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Box
            backgroundColor="primary"
            alignItems="center"
            justifyContent="center"
            height={52}
            width={52}
            borderRadius={12}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </Box>
        </Pressable>
        <Text variant="title">History</Text>
        <Pressable onPress={handleTrashPress}>
          <Box
            backgroundColor="primary"
            alignItems="center"
            justifyContent="center"
            height={52}
            width={52}
            borderRadius={12}
          >
            <FontAwesome5 name="trash" size={24} color="white" />
          </Box>
        </Pressable>
      </Box>
      <Box height={16} />
      <FlatList
        data={audios}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Box height={8} />}
        ListHeaderComponent={<Box height={16} />}
        ListFooterComponent={
          <Box>
            <Box height={16} />
            {audiosQuery.isFetching && (
              <Box>
                <ActivityIndicator
                  size="large"
                  color={theme.colors.primary}
                  style={{ alignSelf: "center" }}
                />
                <Box height={16} />
              </Box>
            )}
          </Box>
        }
        onEndReached={handleEndReached}
        renderItem={({ item }) => {
          const isPlaying = playing && playing.id === item.id;
          return (
            <Box>
              <Text variant="common" fontSize={12}>
                {formatRelativeTime(item.creationTime)}
              </Text>
              <Pressable onPress={() => handleAudioPress(item.id)}>
                <Box
                  width={"100%"}
                  backgroundColor={isPlaying ? "primary" : "background"}
                  borderWidth={4}
                  borderColor={isPlaying ? "primary" : "secondary"}
                  borderRadius={12}
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="row"
                  paddingVertical="sm"
                  paddingHorizontal="l"
                >
                  <Box flexDirection="row" gap="l" alignItems="center">
                    <FontAwesome
                      name={isPlaying ? "pause" : "play"}
                      size={36}
                      color={
                        isPlaying
                          ? theme.colors.textLight
                          : theme.colors.textDark
                      }
                    />
                    <Text
                      variant="subtitle"
                      color={isPlaying ? "textLight" : "textDark"}
                    >
                      {formatSecondsToTime(
                        isPlaying && remainingSeconds
                          ? remainingSeconds
                          : item.durationSeconds
                      )}
                    </Text>
                  </Box>
                  <Box flexDirection="row" gap="m" alignItems="center">
                    <LanguageItem
                      code={item.sourceLanguage}
                      displayMode="FLAG"
                    />
                    <AntDesign
                      name="arrowright"
                      size={24}
                      color={
                        isPlaying
                          ? theme.colors.textLight
                          : theme.colors.textDark
                      }
                    />
                    <LanguageItem
                      code={item.targetLanguage}
                      displayMode="FLAG"
                    />
                  </Box>
                </Box>
              </Pressable>
            </Box>
          );
        }}
      />
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        width={"100%"}
        padding="m"
      >
        <Box maxWidth={"80%"}>
          <Text variant="common" fontSize={16} fontFamily="InterBold">
            Instant audio delete
          </Text>
          <Text variant="subtitle" fontSize={14}>
            Delete the audio immediately after the translation process.
          </Text>
        </Box>
        <Switch
          value={instantDelete}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          onChange={(e) => handleSwitch(e.nativeEvent.value)}
          trackColor={{
            false: theme.colors.secondary,
            true: theme.colors.green,
          }}
          thumbColor={theme.colors.background}
        />
      </Box>
    </SafeContainer>
  );
}

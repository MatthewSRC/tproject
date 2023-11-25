import languages from "~/localization/languages.json";
import ItalianFlag from "~assets/flags/italian-flag.svg";
import SpanishFlag from "~assets/flags/spanish-flag.svg";
import FrenchFlag from "~assets/flags/french-flag.svg";
import GermanFlag from "~assets/flags/german-flag.svg";
import USFlag from "~assets/flags/us-flag.svg";
import JapaneseFlag from "~assets/flags/japanese-flag.svg";
import ChineseFlag from "~assets/flags/chinese-flag.svg";
import RussianFlag from "~assets/flags/russian-flag.svg";
import SerbianFlag from "~assets/flags/serbian-flag.svg";
import { Box } from "~/components/Box";
import { Text } from "~/components/Text";
import { FontAwesome } from "@expo/vector-icons";

export function LanguageItem({ code, displayMode, selected }: Props) {
  const language: TranslatableLanguage | undefined = languages.find(
    (e) => e.code === code
  );
  if (!language) return null;

  switch (displayMode) {
    case "FLAG":
      return <LanguageFlag code={language.code} />;
    case "FULL":
      return (
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row" justifyContent="center" gap="m">
            <LanguageFlag code={language.code} />
            <Text variant="common">{language.label}</Text>
          </Box>
          {selected && (
            <FontAwesome name="check-circle" size={28} color="black" />
          )}
        </Box>
      );
    default:
      return null;
  }
}

function LanguageFlag({ code }: { code: string }) {
  switch (code) {
    case "it-IT":
      return <ItalianFlag width={40} height={30} />;
    case "es-ES":
      return <SpanishFlag width={40} height={30} />;
    case "fr-FR":
      return <FrenchFlag width={40} height={30} />;
    case "de-DE":
      return <GermanFlag width={40} height={30} />;
    case "en-US":
      return <USFlag width={40} height={30} />;
    case "ja-JP":
      return <JapaneseFlag width={40} height={30} />;
    case "cmn-CN":
      return <ChineseFlag width={40} height={30} />;
    case "ru-RU":
      return <RussianFlag width={40} height={30} />;
    case "sr-RS":
      return <SerbianFlag width={40} height={30} />;
    default:
      return null;
  }
}
interface Props {
  code: string;
  displayMode: LanguageItemDisplayMode;
  selected?: boolean;
}

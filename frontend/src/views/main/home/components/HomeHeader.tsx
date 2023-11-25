import { Box } from "~/components/Box";
import { Image, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MainNavigation } from "../../MainNavigator";

export function HomeHeader() {
  const navigation = useNavigation<MainNavigation>();
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width={"100%"}
    >
      <Image
        style={{ width: 120, height: 60 }}
        source={require("~assets/icon.png")}
      />
      <Pressable onPress={() => navigation.navigate("History")}>
        <Box
          backgroundColor="primary"
          alignItems="center"
          justifyContent="center"
          height={52}
          width={52}
          borderRadius={12}
        >
          <FontAwesome5 name="history" size={24} color="white" />
        </Box>
      </Pressable>
    </Box>
  );
}

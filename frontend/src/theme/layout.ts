import { Dimensions } from "react-native";
import Constants from "expo-constants";

export const { height, width } = Dimensions.get("window");
export const statusBarHeight = Constants.statusBarHeight;

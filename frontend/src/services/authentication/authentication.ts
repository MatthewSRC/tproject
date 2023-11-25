import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { unsecuredGet } from "../api/unsecuredBase";
import { getStoredToken, setStoredToken } from "../storage/storage";

async function getAccessToken(): Promise<string> {
  let token = getStoredToken();
  if (!token) {
    const { idToken } = await GoogleSignin.getTokens();
    const response = await unsecuredGet("getAccessToken", [
      { key: "idToken", value: idToken },
    ]);
    if (response.status === "error" || !response.payload)
      throw new Error(response.payload?.toString());
    token = response.payload as string;
    setStoredToken(token);
  }
  return token;
}

export { getAccessToken };

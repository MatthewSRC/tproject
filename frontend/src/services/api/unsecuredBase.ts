import { baseUrl } from "./constants";
import { createQueryUrl } from "./utilities";

async function unsecuredGet(
  endpoint: string,
  params?: Param[]
): Promise<FetchResponse> {
  try {
    const fullApiUrl = baseUrl + "/auth/" + endpoint + createQueryUrl(params);

    const response = await fetch(fullApiUrl, {
      method: "GET",
    });

    if (!response.ok)
      throw new Error("Request failed with status: " + response.status);

    if (response.status === 404) console.log("Empty response");

    return response.json();
  } catch (error) {
    throw error;
  }
}

export { unsecuredGet };

import { getAccessToken } from "../authentication/authentication";
import { baseUrl } from "./constants";
import { createQueryUrl } from "./utilities";

async function postFile(
  endpoint: string,
  body: FormData,
  params?: Param[]
): Promise<FetchResponse> {
  try {
    const fullApiUrl = baseUrl + "/api/" + endpoint + createQueryUrl(params);
    const accessToken = await getAccessToken();

    const response = await fetch(fullApiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: accessToken,
      },
      body,
    });
    return { status: "success", payload: await response.arrayBuffer() };
  } catch (error) {
    throw error;
  }
}

async function post(endpoint: string, body: Object): Promise<FetchResponse> {
  try {
    const fullApiUrl = baseUrl + "/api/" + endpoint;
    const accessToken = await getAccessToken();

    const response = await fetch(fullApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify(body),
    });

    return response.json();
  } catch (error) {
    throw error;
  }
}

async function put(
  endpoint: string,
  params: Param[],
  body: Object
): Promise<FetchResponse> {
  try {
    const fullApiUrl = baseUrl + "/api/" + endpoint + createQueryUrl(params);
    const accessToken = await getAccessToken();

    const response = await fetch(fullApiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify(body),
    });

    return response.json();
  } catch (error) {
    throw error;
  }
}

async function get(endpoint: string, params?: Param[]): Promise<FetchResponse> {
  try {
    const fullApiUrl = baseUrl + "/api/" + endpoint + createQueryUrl(params);
    const accessToken = await getAccessToken();

    const response = await fetch(fullApiUrl, {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    });

    if (!response.ok)
      throw new Error("Request failed with status: " + response.status);

    if (response.status === 404) console.log("Empty response");

    return response.json();
  } catch (error) {
    throw error;
  }
}

export { get, post, put, postFile };

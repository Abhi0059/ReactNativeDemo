import axios from "axios";
import { baseUrl } from "../../Config";

export async function httpCall(api, req) {
  let finalUrl = baseUrl + api;
  console.log("FINAL_URL", finalUrl);
  console.log(req);
  try {
    const data = await axios
      .post(finalUrl, req, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        let result = response.data;
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log("ErrorAPi", error);
        console.log(error);
        let err = { respCode: 0, message: "Network request failed" };
        return err;
      });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function httpGet(api) {
  let finalUrl = baseUrl + api;
  console.log(finalUrl);
  try {
    const data = await axios
      .get(finalUrl)
      .then((response) => {
        let result = response.data;
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
    return data;
  } catch (error) {
    throw error;
  }
}

import { url } from "../../Config";
import CommanServices from "./comman";
var comman = new CommanServices();
export default class RestApi {
  constructor() {
    (this.responseFromApi = {}), (this.url = ""), (this.request = {});
  }

  setUrl(url) {
    this.url = url;
  }

  setReq(req) {
    this.request = req;
  }

  sendRequest(successHandler) {
    fetch(url["baseUrl"] + this.url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.request),
    })
      .then((response) => response.json())
      .then((json) => {
        successHandler(json);
        this.responseFromApi = json;
        return json;
      })
      .catch((error) => {
        console.log("ErrorAPi", error);
        console.log(error);
        let err = {
          respCode: 0,
          message: "Request failed with status code 500",
        };
        return err;
      });
  }

  returnResponse(successHandler) {
    successHandler(this.responseFromApi);
  }

  getRequest(successHandler) {
    fetch(url["baseUrl"] + this.url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        successHandler(responseJson);
        // this.responseFromApi = responseJson
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteRequest(successHandler) {
    fetch(url["baseUrl"] + this.url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.request),
    })
      .then((response) => response.json())
      .then((json) => {
        // this.responseFromApi = json
        successHandler(json);

        return json;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  }
}

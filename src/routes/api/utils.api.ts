import axios, { AxiosResponse } from "axios";

export class UtilsApi {
  static async getCountryCodes(): Promise<AxiosResponse> {
    return axios({
      method: "get",
      url: "/api/country-codes",
    });
  }
}

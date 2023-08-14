import COUNTRY_CODES from "./CC.json";
import { ICountryCode } from "@/app/api/interfaces/country-codes";

export async function GET() {
  return new Response(
    JSON.stringify(
      COUNTRY_CODES.sort((a: ICountryCode, b: ICountryCode) =>
        a.dial_code.slice(1) > b.dial_code.slice(1) ? 1 : -1
      )
    ),
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );
}

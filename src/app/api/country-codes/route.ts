import COUNTRY_CODES from "./CC.json";
import { ICountryCode } from "@/app/api/interfaces/country-codes";

export async function GET() {
  return new Response(
    JSON.stringify(
      COUNTRY_CODES.sort((a: ICountryCode, b: ICountryCode) =>
        a.name.localeCompare(b.name)
      )
    ),
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );
}

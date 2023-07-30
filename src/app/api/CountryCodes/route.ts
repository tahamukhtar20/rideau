import COUNTRY_CODES from "./CC.json";

export async function GET() {
  return new Response(JSON.stringify(COUNTRY_CODES), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

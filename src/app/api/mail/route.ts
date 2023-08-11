const nodemailer = require("nodemailer");
export async function POST(data: any) {
  const body = await data.json();
  console.log(body);
  return new Response(JSON.stringify({ message: "Email sent" }), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}

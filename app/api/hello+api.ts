const secretKey = process.env.MY_SECRET_KEY;
const env = process.env.NODE_ENV;
export function GET(request: Request) {
  return Response.json({ key: secretKey, env });
}

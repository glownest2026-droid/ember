export const dynamic = "force-static";
export default function Ping() {
  return <pre style={{padding:16}}>pong – {new Date().toISOString()}</pre>;
}

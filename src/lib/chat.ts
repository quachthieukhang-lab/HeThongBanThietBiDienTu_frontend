export async function sendChatMessage(message: string) {
  const res = await fetch("http://localhost:3000/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    console.error("API error:", res);
    throw new Error("API Error");
  }

  const data = await res.json();
  return data.reply;
}

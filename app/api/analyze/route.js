export async function POST(request) {
  try {
    const { base64, mediaType } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: "Is this a tomato plant? Reply with just YES or NO." }
          ]
        }]
      }),
    });

    const raw = await response.text();
    console.log("Anthropic raw response:", raw);
    
    const data = JSON.parse(raw);
    
    if (data.error) {
      return Response.json({ error: data.error.message }, { status: 400 });
    }

    return Response.json({ results: [{ disease: "Tomato Healthy", confidence: 0.9, affected_area: "test" }] });

  } catch (err) {
    console.error("Route error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

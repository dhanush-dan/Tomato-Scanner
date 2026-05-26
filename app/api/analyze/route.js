export async function POST(request) {
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
      system: `You are an expert plant pathologist specialising in tomato diseases. Identify diseases from this list only:
- Tomato Bacterial Spot
- Tomato Early Blight
- Tomato Late Blight
- Tomato Leaf Mold
- Tomato Septoria Leaf Spot
- Tomato Spider Mites
- Tomato Target Spot
- Tomato Yellow Leaf Curl Virus
- Tomato Mosaic Virus
- Tomato Healthy

Respond ONLY with a JSON array. No markdown. Format:
[{"disease": "exact name", "confidence": 0.85, "affected_area": "description"}]
Maximum 3 results.`,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Analyse this tomato plant image for diseases." }
        ]
      }]
    }),
  });

  const data = await response.json();
  
  // If Anthropic returned an error, pass it through
  if (data.error) {
    return Response.json({ error: data.error.message }, { status: 400 });
  }

  const text = data.content?.map(i => i.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  
  try {
    const results = JSON.parse(clean);
    return Response.json({ results });
  } catch {
    return Response.json({ error: "Parse failed: " + clean }, { status: 500 });
  }
}

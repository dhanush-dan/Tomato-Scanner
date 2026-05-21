import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { base64, mediaType } = await request.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are an expert plant pathologist specialising in tomato diseases. Analyse tomato plant images and identify diseases from this exact list only:
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

Respond ONLY with a JSON array. No preamble, no markdown, no explanation. Format:
[{"disease": "exact disease name from list", "confidence": 0.85, "affected_area": "brief description of where on the plant"}]

If the plant is healthy return: [{"disease": "Tomato Healthy", "confidence": 0.95, "affected_area": "whole plant"}]
If it is not a tomato plant return: [{"disease": "Tomato Healthy", "confidence": 0.1, "affected_area": "not a tomato plant"}]
List all diseases you detect, most confident first. Maximum 3 results.`,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: 'Analyse this tomato plant image for diseases.' }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.map(i => i.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const results = JSON.parse(clean);
    return NextResponse.json({ results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

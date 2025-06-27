// app/api/analyze/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { complaint } = await request.json();

    if (!complaint) {
      return NextResponse.json(
        { message: 'Complaint text is required' },
        { status: 400 }
      );
    }

    // Sentiment Analysis (Severity)
    const severityResponse = await fetch(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
        body: JSON.stringify({ inputs: complaint }),
      }
    );

    if (!severityResponse.ok) {
      const errorData = await severityResponse.json();
      console.error('Hugging Face API Error (Severity):', errorData);
      throw new Error('Failed to analyze severity');
    }

    const severityData = await severityResponse.json();
    const severity = severityData[0][0].label === 'POSITIVE' ? 'Low' : 'High';

    // Zero-Shot Classification (Category)
    const categoryResponse = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: complaint,
          parameters: {
            candidate_labels: ['Anti-Ragging Cell', 'Narcotic Cell', 'Human Rights Commission','Other'],
          },
        }),
      }
    );

    if (!categoryResponse.ok) {
      const errorData = await categoryResponse.json();
      console.error('Hugging Face API Error (Category):', errorData);
      throw new Error('Failed to analyze category');
    }

    const categoryData = await categoryResponse.json();
    const authority = categoryData.labels[0];

    return NextResponse.json({ severity, authority }, { status: 200 });
  } catch (error) {
    console.error('Error analyzing complaint:', error);
    return NextResponse.json(
      { message: 'Error analyzing complaint', error: error.message },
      { status: 500 }
    );
  }
}
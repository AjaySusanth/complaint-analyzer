// app/page.js
'use client';

import { useState } from 'react';

export default function Home() {
  const [complaint, setComplaint] = useState('');
  const [severity, setSeverity] = useState(null);
  const [authority, setAuthority] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeComplaint = async () => {
    if (!complaint.trim()) {
      setError('Please enter a complaint.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ complaint }),
      });

      const data = await response.json();

      if (response.ok) {
        setSeverity(data.severity);
        setAuthority(data.authority);
      } else {
        setError(data.message || 'Error analyzing complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Complaint Analyzer</h1>
      <textarea
        rows="10"
        cols="50"
        placeholder="Enter your complaint here..."
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      ></textarea>
      <br />
      <button
        onClick={analyzeComplaint}
        disabled={loading}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Complaint'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {severity !== null && authority !== null && (
        <div style={{ marginTop: '20px' }}>
          <h2>Analysis Result</h2>
          <p>
            <strong>Severity:</strong> {severity}
          </p>
          <p>
            <strong>Authority to Notify:</strong> {authority}
          </p>
        </div>
      )}
    </div>
  );
}
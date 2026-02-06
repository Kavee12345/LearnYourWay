import React, { useState } from 'react';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [lesson, setLesson] = useState(null);

  // Get API URL from environment, fallback to localhost
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !title) {
      setMessage('Please select a file and enter a title');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', title);

      console.log('Uploading to:', `${API_BASE}/api/upload`);

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) || 60000
      });

      setMessage('✅ PDF uploaded successfully!');
      setLesson(response.data.lesson);
      setFile(null);
      setTitle('');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Network error';
      setMessage(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '32px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>📄 PDF Uploader</h1>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Lesson Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lesson title"
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Select PDF File:</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              marginTop: '5px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: message.includes('❌') ? '#f8d7da' : '#d4edda',
          color: message.includes('❌') ? '#721c24' : '#155724',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {lesson && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#e7f3ff',
          borderRadius: '4px',
          border: '1px solid #b3d9ff'
        }}>
          <h2>✨ Lesson Created</h2>
          <p><strong>Title:</strong> {lesson.title}</p>
          <p><strong>Summary:</strong> {lesson.summary}</p>
          <p><strong>Visual Concepts:</strong></p>
          <ul>
            {lesson.visualConcepts.map((concept, i) => (
              <li key={i}>{concept}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Home</a>
      </div>
    </main>
  );
}

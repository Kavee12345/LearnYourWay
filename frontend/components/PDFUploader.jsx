"use client";

import React, { useState } from 'react';
import { uploadPDF } from '@/services/api';

export const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setMessage('Only PDF files are allowed');
        setMessageType('error');
        setFile(null);
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        setMessage('File size must be less than 50MB');
        setMessageType('error');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title.trim()) {
      setMessage('Please select a file and enter a title');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setProgress(0);
    try {
      const response = await uploadPDF(file, title);
      setMessage(`✓ Lesson created successfully! Lesson ID: ${response.data.lessonId}`);
      setMessageType('success');
      setFile(null);
      setTitle('');
      setProgress(100);

      setTimeout(() => {
        setMessage('');
        setProgress(0);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to upload PDF';
      setMessage(`✗ Error: ${errorMsg}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Lesson from PDF</h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Lesson Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            placeholder="Enter lesson title (e.g., Quantum Physics 101)"
            maxLength={100}
          />
          <p className="text-gray-500 text-sm mt-1">{title.length}/100</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select PDF File</label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={loading}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 text-gray-500 focus:outline-none hover:border-blue-400 transition cursor-pointer"
            />
            {file && (
              <div className="mt-2 text-sm text-green-600">
                ✓ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-2">Maximum file size: 50MB</p>
        </div>

        {loading && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm mt-2 text-center">Processing PDF...</p>
          </div>
        )}

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file || !title.trim()}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Processing...' : 'Create Lesson'}
        </button>
      </form>
    </div>
  );
};

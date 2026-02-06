import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{padding: 32, fontFamily: 'Arial, sans-serif'}}>
      <h1>Learn Your Way — Frontend</h1>
      <p>Welcome to the frontend. Use the links below to explore demo pages.</p>
      <ul>
        <li><Link href="/upload">PDF Uploader (demo)</Link></li>
        <li><Link href="/quiz">Quiz (demo)</Link></li>
      </ul>
    </main>
  );
}

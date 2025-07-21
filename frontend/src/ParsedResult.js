import React from 'react';
import { downloadJSON } from './utils/file';

function ParsedResult({ parsed }) {
  return (
    <section className="glass bg-black/40 border border-white/10 shadow-2xl p-6 flex flex-col gap-4 w-full animate-fade-in">
      <h2 className="text-xl font-semibold text-white mb-2">Parsed Resume Data</h2>
      {parsed.raw_text && (
        <div className="mb-4">
          <div className="font-bold mb-1 text-gray-300">Raw Text:</div>
          <div className="bg-gray-900 p-2 rounded h-48 overflow-auto whitespace-pre-wrap text-xs border font-mono text-gray-100">
            {parsed.raw_text}
          </div>
        </div>
      )}
      {parsed.links && Array.isArray(parsed.links) && parsed.links.length > 0 && (
        <div className="mb-4">
          <div className="font-bold mb-1 text-gray-300">Links:</div>
          <ul className="bg-gray-900 p-2 rounded h-32 overflow-auto text-xs border text-blue-300">
            {parsed.links.map((link, i) => (
              <li key={i}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 transition">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          className="px-4 py-2 bg-gradient-to-r from-green-700 to-blue-700 text-white font-semibold hover:scale-105 transition"
          onClick={() => downloadJSON(parsed, 'parsed_resume.json')}
        >
          Download JSON
        </button>
      </div>
    </section>
  );
}

export default ParsedResult; 
import React, { useState } from 'react';

const TestTextarea = () => {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Calculate word count
    const words = newText.trim() === '' ? 0 : newText.trim().split(/\s+/).length;
    setWordCount(words);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Textarea</h2>
        
        <div className="mb-4">
          <label htmlFor="test-textarea" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your text:
          </label>
          <textarea
            id="test-textarea"
            value={text}
            onChange={handleTextChange}
            className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            placeholder="Start typing here... This is a test textarea component for your Class Measures Hub application."
            rows={8}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="space-x-4">
            <span>Characters: <strong>{text.length}</strong></span>
            <span>Words: <strong>{wordCount}</strong></span>
            <span>Lines: <strong>{text.split('\n').length}</strong></span>
          </div>
          
          {text.length > 0 && (
            <button
              onClick={() => {
                setText('');
                setWordCount(0);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        {text.length > 500 && (
          <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p className="text-sm">
              <strong>Note:</strong> Your text is getting quite long ({text.length} characters). 
              Consider breaking it into smaller sections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestTextarea;

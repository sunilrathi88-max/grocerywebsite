import React, { useState } from 'react';
import { QnA as QnAType } from '../types';

interface QnAProps {
  qna: QnAType[];
  onAskQuestion: (question: { author: string; question: string }) => void;
}

const QnA: React.FC<QnAProps> = ({ qna, onAskQuestion }) => {
  const [author, setAuthor] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (author.trim() && question.trim()) {
      onAskQuestion({ author, question });
      setAuthor('');
      setQuestion('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="font-bold text-brand-dark mb-4">Ask a Question</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="qna-author" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="qna-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="qna-question" className="block text-sm font-medium text-gray-700">
              Your Question
            </label>
            <textarea
              id="qna-question"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-dark text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            Submit Question
          </button>
        </form>
      </div>
      <div>
        <h4 className="font-bold text-brand-dark mb-4">Questions & Answers</h4>
        <div className="max-h-64 overflow-y-auto pr-2 -mr-2 space-y-4">
          {qna.length > 0 ? (
            qna.map((item) => (
              <div key={item.id} className="text-sm">
                <p className="font-bold text-brand-dark">Q: {item.question}</p>
                <p className="text-gray-500 mb-2">by {item.author}</p>
                {item.answer ? (
                  <p className="text-gray-700 pl-4 border-l-2 border-brand-primary">
                    <span className="font-bold">A:</span> {item.answer}
                  </p>
                ) : (
                  <p className="text-gray-400 italic pl-4 border-l-2 border-gray-200">
                    Awaiting answer...
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No questions have been asked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QnA;

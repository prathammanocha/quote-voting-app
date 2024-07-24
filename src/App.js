import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';

const QuoteVotingApp = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/getQuotes');
      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }
      const data = await response.json();
      setQuotes(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleVote = (id, liked) => {
    setQuotes(prevQuotes =>
      prevQuotes.map(quote =>
        quote.id === id
          ? {
              ...quote,
              votes: liked ? quote.votes + 1 : quote.votes,
              totalVotes: quote.totalVotes + 1,
            }
          : quote
      )
    );
  };

  const sortedQuotes = [...quotes].sort((a, b) => 
    (b.votes / b.totalVotes || 0) - (a.votes / a.totalVotes || 0)
  );

  if (loading) return <div className="text-center py-4">Loading quotes...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quote Voting App</h1>
      {sortedQuotes.map(quote => (
        <div key={quote.id} className="mb-4 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4">
            <p className="text-lg">{quote.text}</p>
            <div className="mt-2 bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(quote.votes / quote.totalVotes * 100) || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {((quote.votes / quote.totalVotes * 100) || 0).toFixed(1)}% liked
            </p>
          </div>
          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => handleVote(quote.id, true)}
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <ThumbsUp className="mr-2" size={16} /> Like
            </button>
            <button
              onClick={() => handleVote(quote.id, false)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              Dislike
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuoteVotingApp;

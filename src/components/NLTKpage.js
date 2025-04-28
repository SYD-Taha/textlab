import React, { useState } from 'react';
import axios from 'axios';

function NltkPage({ onActionTrigger }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('tokenize');

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const handleActionChange = (action) => {
    setSelectedAction(action);
  };

  const analyzeText = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://127.0.0.1:5000/${selectedAction}`, { text });
      setResult(response.data);
    } catch (error) {
      console.error('Error making API request', error);
      setResult({ error: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  const triggerAction = (action, newText) => {
    handleActionChange(action);
    handleTextChange(newText);
    analyzeText();
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.error) {
      return <p style={{ color: 'red' }}>{result.error}</p>;
    }

    if (selectedAction === 'tokenize' && result.tokens) {
      return (
        <div>
          <h3>Tokens:</h3>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {result.tokens.map((token, index) => (
              <li key={index} style={{ marginBottom: "5px", padding: "5px", backgroundColor: "#f4f4f4", borderRadius: "5px" }}>
                {token}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedAction === 'clean' && result.clean_tokens) {
      return (
        <div>
          <h3>Clean Tokens:</h3>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {result.clean_tokens.map((token, index) => (
              <li key={index} style={{ marginBottom: "5px", padding: "5px", backgroundColor: "#e0f7fa", borderRadius: "5px" }}>
                {token}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedAction === 'keywords' && result.keywords) {
      return (
        <div>
          <h3>Keywords:</h3>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {result.keywords.map((word, index) => (
              <li key={index} style={{ marginBottom: "5px", padding: "5px", backgroundColor: "#ffe0b2", borderRadius: "5px" }}>
                {word}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedAction === 'ner' && result.entities) {
      return (
        <div>
          <h3>Named Entities:</h3>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {result.entities.map((entity, index) => (
              <li key={index} style={{ marginBottom: "5px", padding: "5px", backgroundColor: "#f3e5f5", borderRadius: "5px" }}>
                <strong>{entity.entity}</strong> ({entity.type})
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedAction === 'sentiment' && result.sentiment) {
      return (
        <div>
          <h3>Sentiment Analysis:</h3>
          <ul>
            <li>Positive: {result.sentiment.pos}</li>
            <li>Neutral: {result.sentiment.neu}</li>
            <li>Negative: {result.sentiment.neg}</li>
            <li>Compound: {result.sentiment.compound}</li>
          </ul>
        </div>
      );
    }

    return <p>No data to display.</p>;
  };

  React.useEffect(() => {
    if (onActionTrigger) {
      onActionTrigger(triggerAction);
    }
  }, [onActionTrigger]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>NLP Analyzer with NLTK + Flask</h2>

      {loading && <div style={{ marginTop: "20px" }}>Loading...</div>}

      <div style={{ marginTop: "20px" }}>
        {renderResult()}
      </div>
    </div>
  );
}

export default NltkPage;

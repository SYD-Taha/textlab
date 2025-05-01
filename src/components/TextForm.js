import React, { useState } from 'react';

export default function TextForm(props) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [selectedAction, setSelectedAction] = useState('tokenize');

  const handleUpClick = () => {
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Converted to UpperCase!", "success");
  };

  const handlelowClick = () => {
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Converted to LowerCase!", "success");
  };

  const clear = () => {
    setText('');
    props.showAlert("Text Cleared!", "success");
  };

  const speak = () => {
    let msg = new SpeechSynthesisUtterance();
    msg.text = text;
    window.speechSynthesis.speak(msg);
    props.showAlert("Speaking!", "success");
  };

  const handleOnChange = (event) => {
    setText(event.target.value);
  };

  const Copy = () => {
    navigator.clipboard.writeText(text);
    props.showAlert("Text Copied!", "success");
  };

  const handleExtraSpaces = () => {
    let newText = text.split(/[ ]+/); 
    setText(newText.join(" "));
    props.showAlert("Extra Spaces Removed!", "success");
  };

  const analyzeText = async (action) => {
    try {
      const response = await fetch(`https://teejay.pythonanywhere.com/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      console.log('API response:', data);   
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to fetch data' });
    }
  };

  const handleActionChange = (action) => {
    setSelectedAction(action);
    analyzeText(action);
  };

  const renderResult = () => {
    if (!result) return null;
    if (result.error) return <p style={{ color: 'red' }}>{result.error}</p>;

    switch (selectedAction) {
      case 'tokenize':
        return result.tokens && (
          <div>
            <h3>Tokens:</h3>
            <ul>
              {result.tokens.map((token, index) => <li key={index}>{token}</li>)}
            </ul>
          </div>
        );

      case 'sentiment':
        return result.sentiment && (
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

      case 'keywords':
        return result.keywords && (
          <div>
            <h3>Extracted Keywords:</h3>
            <ul>
              {result.keywords.map((keyword, index) => <li key={index}>{keyword}</li>)}
            </ul>
          </div>
        );

      case 'ner':
        return result.entities && (
          <div>
            <h3>Named Entity Recognition (NER):</h3>
            <ul>
              {result.entities.map((entity, index) => (
                <li key={index}>{entity.entity} ({entity.type})</li>
              ))}
            </ul>
          </div>
        );

      case 'summarize':
        return result.summary && (
          <div>
            <h3>Summary:</h3>
            <p style={{ backgroundColor: "#e8f5e9", padding: "10px", borderRadius: "5px" }}>{result.summary}</p>
          </div>
        );

      default:
        return <p>No data to display.</p>;
    }
  };

  return (
    <>
      <div className="container" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
        <h1 className='mb-4'>{props.heading}</h1>
        <div className="mb-3">
          <textarea 
            className='form-control' 
            value={text} 
            onChange={handleOnChange} 
            style={{ backgroundColor: props.mode === 'dark' ? '#13466e' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }} 
            id="mybox" 
            rows="8">
          </textarea>
        </div>

        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={handleUpClick}>Uppercase</button>
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={handlelowClick}>Lowercase</button>
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={speak}>Speak</button>
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={clear}>Clear</button>
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={Copy}>Copy</button>
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={handleExtraSpaces}>Remove Spaces</button>

        {/* NLP Buttons */}
        <div className="mt-4">
          <h3>Run NLP Actions</h3>
          <button disabled={text.length === 0} className="btn btn-outline-info mx-1" onClick={() => handleActionChange('tokenize')}>Tokenize</button>
          <button disabled={text.length === 0} className="btn btn-outline-info mx-1" onClick={() => handleActionChange('sentiment')}>Sentiment</button>
          <button disabled={text.length === 0} className="btn btn-outline-info mx-1" onClick={() => handleActionChange('keywords')}>Keywords</button>
          <button disabled={text.length === 0} className="btn btn-outline-info mx-1" onClick={() => handleActionChange('ner')}>NER</button>
          <button disabled={text.length === 0} className="btn btn-outline-success mx-1" onClick={() => handleActionChange('summarize')}>Summarize</button>
        </div>

        <div className="mt-4">
          {renderResult()}
        </div>
      </div>
    </>
  );
}

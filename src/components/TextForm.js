import React, { useState } from 'react';

export default function TextForm(props) {
  
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('tokenize');
  
  const handleUpClick = () => {
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Converted to UpperCase!", "success");
  }

  const handlelowClick = () => {
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Converted to LowerCase!", "success");
  }

  const clear = () => {
    setText('');
    props.showAlert("Text Cleared!", "success");
  }

  const speak = () => {
    let msg = new SpeechSynthesisUtterance();
    msg.text = text;
    window.speechSynthesis.speak(msg);
    props.showAlert("Speaking!", "success");
  }

  const handleOnChange = (event) => {
    setText(event.target.value);
  }

  const Copy = () => {
    navigator.clipboard.writeText(text);
    props.showAlert("Text Copied!", "success");
  }

  const handleExtraSpaces = () => {
    let newText = text.split(/[ ]+/); 
    setText(newText.join(" "));
    props.showAlert("Extra Spaces Removed!", "success");
  }

  const analyzeText = async (action) => {
    // setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to fetch data' });
    } finally {
      // setLoading(false);
    }
  }

  const handleActionChange = (action) => {
    setSelectedAction(action);
    analyzeText(action);
  }

  const renderResult = () => {
    if (!result) return null;
    if (result.error) return <p style={{ color: 'red' }}>{result.error}</p>;

    // Render different results based on selected action
    if (selectedAction === 'tokenize' && result.tokens) {
      return (
        <div>
          <h3>Tokens:</h3>
          <ul>
            {result.tokens.map((token, index) => (
              <li key={index}>{token}</li>
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

    if (selectedAction === 'keywords' && result.keywords) {
      return (
        <div>
          <h3>Extracted Keywords:</h3>
          <ul>
            {result.keywords.map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedAction === 'ner' && result.entities) {
      return (
        <div>
          <h3>Named Entity Recognition (NER):</h3>
          <ul>
            {result.entities.map((entity, index) => (
              <li key={index}>{entity}</li>
            ))}
          </ul>
        </div>
      );
    }

    return <p>No data to display.</p>;
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

        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={handleUpClick}>Convert to Uppercase</button>
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={handlelowClick}>Convert to lowercase</button>        
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={speak}>Speak</button>
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={clear}>Clear</button>
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={Copy}>Copy Text</button>
        <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" onClick={handleExtraSpaces}>Remove Extra Spaces</button>
        
        <div className="container my-3" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
          <h2>Your Text summary</h2>
          <p> {text.split(/\s+/).filter((element) => { return element.length !== 0 }).length} words and {text.length} characters</p>
          <p> {0.008 * text.split(" ").filter((element) => { return element.length !== 0 }).length} Minutes read</p>
          
          <h3>Preview</h3>
          <p>{text.length > 0 ? text : "Enter something to preview"}</p>
        </div>

        <hr className="my-4" /> {/* Horizontal Line for separation */}
        
        {/* New NLP Action Buttons Section */}
        <div className="container my-3">
          <h3>Use the new Implemented NLP Features</h3>
          <div className="d-flex flex-wrap justify-content-start">
            <button 
              disabled={text.length === 0} 
              className="btn btn-primary mx-2 my-1" 
              onClick={() => handleActionChange('tokenize')}
            >
              Tokenize
            </button>
            <button 
              disabled={text.length === 0} 
              className="btn btn-primary mx-2 my-1" 
              onClick={() => handleActionChange('sentiment')}
            >
              Sentiment Analysis
            </button>
            <button 
              disabled={text.length === 0} 
              className="btn btn-primary mx-2 my-1" 
              onClick={() => handleActionChange('keywords')}
            >
              Extract Keywords
            </button>
            <button 
              disabled={text.length === 0} 
              className="btn btn-primary mx-2 my-1" 
              onClick={() => handleActionChange('ner')}
            >
              Named Entity Recognition
            </button>
          </div>
        </div>

        {/* Render Results */}
        <div className="result-container" style={{ marginLeft: '20px', marginTop: '20px' }}>{renderResult()}</div>
      </div>
    </>
  );
}

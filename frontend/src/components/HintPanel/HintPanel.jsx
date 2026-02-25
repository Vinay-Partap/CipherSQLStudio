import { useState } from 'react';
import './HintPanel.scss';

function HintPanel({ onGetHint, isLoading }) {
  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);

  async function handleGetHint() {
    const result = await onGetHint();
    setHint(result.hint);
    setShowHint(true);
  }

  return (
    <div className="hint-panel">
      <div className="hint-panel__header">
        <h4>💡 Stuck?</h4>
        <button 
          className="hint-btn"
          onClick={handleGetHint}
          disabled={isLoading}
        >
          {isLoading ? 'Thinking...' : 'Get Hint'}
        </button>
      </div>
      
      {showHint && hint && (
        <div className="hint-box">
          <p>{hint}</p>
          <button 
            className="hint-hide"
            onClick={() => setShowHint(false)}
          >
            Hide
          </button>
        </div>
      )}
    </div>
  );
}

export default HintPanel;
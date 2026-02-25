import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignment, executeQuery, getHint } from '../services/api.js';
import SqlEditor from '../components/SqlEditor/SqlEditor.jsx';
import ResultsPanel from '../components/ResultsPanel/ResultsPanel.jsx';
import SampleDataViewer from '../components/SampleDataViewer/SampleDataViewer.jsx';
import HintPanel from '../components/HintPanel/HintPanel.jsx';
import './Assignment.scss';

function Assignment() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  
  // Get or create session ID
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem('ciphersql_session');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('ciphersql_session', sid);
    }
    return sid;
  });

  useEffect(() => {
    loadAssignment();
  }, [id]);

  async function loadAssignment() {
    try {
      const data = await getAssignment(id);
      setAssignment(data);
    } catch (err) {
      console.error('Failed to load assignment:', err);
    }
  }

  async function handleExecute() {
    if (!query.trim()) return;
    
    setIsExecuting(true);
    setResult(null);
    
    try {
      const response = await executeQuery(id, query, sessionId);
      setResult(response);
    } catch (err) {
      setResult({ success: false, error: 'Failed to execute query: ' + err.message });
    } finally {
      setIsExecuting(false);
    }
  }

  async function handleGetHint() {
    setIsLoadingHint(true);
    try {
      const errorMessage = result?.error || null;
      const response = await getHint(id, query, errorMessage);
      setIsLoadingHint(false);
      return response;
    } catch {
      setIsLoadingHint(false);
      return { hint: 'Think about what data you need and how to filter it.' };
    }
  }

  if (!assignment) return <div className="loading">Loading assignment...</div>;

  // Pre-calculate values to avoid complex expressions in JSX
  const difficultyClass = (assignment.description?.toLowerCase()) || 'easy';
  const difficultyLabel = assignment.description || 'Easy';

  return (
    <div className="assignment-page">
      {/* Sidebar - Question & Data */}
      <aside className="assignment-page__sidebar">
        <div className="question-panel">
          <div className="question-panel__header">
            <h1>{assignment.title}</h1>
            <span className={`difficulty difficulty--${difficultyClass}`}>
              {difficultyLabel}
            </span>
          </div>
          <p className="question-panel__text">{assignment.question}</p>
        </div>
        
        <SampleDataViewer tables={assignment.sampleTables || []} />
        <HintPanel onGetHint={handleGetHint} isLoading={isLoadingHint} />
      </aside>

      {/* Main - Editor */}
      <main className="assignment-page__main">
        <SqlEditor 
          value={query}
          onChange={setQuery}
          onExecute={handleExecute}
          isExecuting={isExecuting}
        />
      </main>

      {/* Results */}
      <aside className="assignment-page__results">
        <ResultsPanel result={result} />
      </aside>
    </div>
  );
}

export default Assignment;
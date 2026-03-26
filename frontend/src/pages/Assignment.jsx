import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignments, executeQuery, getHint } from '../services/api';
import Editor from '@monaco-editor/react';
import './Assignment.scss';

function AssignmentPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');
  const [executing, setExecuting] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    loadAssignment();
  }, [id]);

  async function loadAssignment() {
    try {
      const data = await getAssignments();
      const found = data.find(a => String(a.id) === String(id));
      setAssignment(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute() {
    if (!query.trim()) return;
    setExecuting(true);
    setError('');
    setResult(null);
    try {
      const data = await executeQuery(id, query, sessionId);
      setResult(data);
      // Mark as solved in localStorage
const solvedList = JSON.parse(localStorage.getItem('solvedAssignments') || '[]');
if (!solvedList.includes(Number(id))) {
  solvedList.push(Number(id));
  localStorage.setItem('solvedAssignments', JSON.stringify(solvedList));
}
    } catch (err) {
      setError(err.message || 'Query execution failed');
    } finally {
      setExecuting(false);
    }
  }

  async function handleHint() {
    setHintLoading(true);
    setHint('');
    try {
      const data = await getHint(id, query, error);
      setHint(data.hint);
    } catch (err) {
      setHint('Could not get hint. Try again.');
    } finally {
      setHintLoading(false);
    }
  }

  if (loading) return <div>Loading assignment...</div>;
  if (!assignment) return <div>Assignment not found</div>;

  return (
    <div className="assignment-page">
      <div className="assignment-page__sidebar">
        <div className="question-panel">
          <div className="question-panel__header">
            <h1>{assignment.title}</h1>
          </div>
          <p className="question-panel__text">
            {assignment.question || assignment.description}
          </p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>Sample Table:</h3>
          {assignment.sampleTables?.map((table, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <h4>{table.tableName}</h4>
              <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    {table.columns.map(col => (
                      <th key={col.columnName}>{col.columnName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {hint && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
            <h4>💡 Hint:</h4>
            <p>{hint}</p>
          </div>
        )}
      </div>

      <div className="assignment-page__main">
        <Editor
          height="100%"
          language="sql"
          value={query}
          onChange={(val) => setQuery(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16 }
          }}
        />
      </div>

      <div className="assignment-page__results">
        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleExecute}
            disabled={executing}
            style={{ padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            {executing ? 'Running...' : '▶ Run Query'}
          </button>
          <button
            onClick={handleHint}
            disabled={hintLoading}
            style={{ padding: '0.5rem 1rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            {hintLoading ? 'Loading...' : '💡 Get Hint'}
          </button>
        </div>

        <div style={{ padding: '1rem', overflowY: 'auto' }}>
          {error && (
            <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '6px', color: '#dc2626' }}>
              ❌ {error}
            </div>
          )}

          {result && (
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>Result:</h4>
              <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    {result.columns?.map((col, i) => (
                      <th key={i}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows?.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!error && !result && (
            <p style={{ color: '#94a3b8' }}>Query results will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignmentPage;
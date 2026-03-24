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
      const data = await executeQuery(query, id);
      setResult(data);
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

  if (loading) return <div className="loading">Loading assignment...</div>;
  if (!assignment) return <div className="not-found">Assignment not found</div>;

  return (
    <div className="assignment-page">
      <div className="assignment-header">
        <h2>{assignment.title}</h2>
        <p>{assignment.description}</p>
      </div>

      <div className="assignment-content">
        <div className="left-panel">
          <div className="sample-tables">
            <h3>Sample Table:</h3>
            {assignment.sampleTables.map((table, index) => (
              <div key={index} className="table-wrapper">
                <h4>{table.tableName}</h4>
                <table>
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
            <div className="hint-box">
              <h4>Hint:</h4>
              <p>{hint}</p>
            </div>
          )}
        </div>

        <div className="right-panel">
          <div className="editor-wrapper">
            <Editor
              height="200px"
              language="sql"
              value={query}
              onChange={(val) => setQuery(val || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          <div className="action-buttons">
            <button
              className="execute-btn"
              onClick={handleExecute}
              disabled={executing}
            >
              {executing ? 'Executing...' : 'Execute Query'}
            </button>
            <button
              className="hint-btn"
              onClick={handleHint}
              disabled={hintLoading}
            >
              {hintLoading ? 'Getting hint...' : 'Get Hint'}
            </button>
          </div>

          {error && <div className="error-box">{error}</div>}

          {result && (
            <div className="result-box">
              <h4>Result:</h4>
              <table>
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
        </div>
      </div>
    </div>
  );
}

export default AssignmentPage;
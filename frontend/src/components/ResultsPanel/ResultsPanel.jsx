import './ResultsPanel.scss';

function ResultsPanel({ result }) {
  if (!result) {
    return (
      <div className="results-panel results-panel--empty">
        <p>Run a query to see results</p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="results-panel results-panel--error">
        <div className="error-header">⚠ Error</div>
        <p className="error-message">{result.error}</p>
      </div>
    );
  }

  if (result.success && result.rows.length === 0) {
    return (
      <div className="results-panel">
        <div className="results-header">
          Query executed successfully. 0 rows returned.
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <div className="results-header">
        {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} returned
      </div>
      
      <div className="results-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              {result.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, idx) => (
              <tr key={idx}>
                {result.columns.map((col) => (
                  <td key={col}>
                    {row[col] === null ? <span className="null">NULL</span> : String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsPanel;
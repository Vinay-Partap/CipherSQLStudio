import { useState } from 'react';
import './SampleDataViewer.scss';

function SampleDataViewer({ tables }) {
  const [expandedTable, setExpandedTable] = useState(tables[0]?.tableName);

  if (!tables || tables.length === 0) return null;

  return (
    <div className="sample-data-viewer">
      <h4>Sample Data</h4>
      
      <div className="table-tabs">
        {tables.map((table) => (
          <button
            key={table.tableName}
            className={`table-tab ${expandedTable === table.tableName ? 'active' : ''}`}
            onClick={() => setExpandedTable(table.tableName)}
          >
            {table.tableName}
          </button>
        ))}
      </div>
      
      {tables.map((table) => (
        expandedTable === table.tableName && (
          <div key={table.tableName} className="table-data">
            <table className="data-table">
              <thead>
                <tr>
                  {table.columns.map((col) => (
                    <th key={col.columnName}>
                      {col.columnName}
                      <span className="data-type">{col.dataType}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, idx) => (
                  <tr key={idx}>
                    {table.columns.map((col) => (
                      <td key={col.columnName}>
                        {row[col.columnName]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ))}
    </div>
  );
}

export default SampleDataViewer;
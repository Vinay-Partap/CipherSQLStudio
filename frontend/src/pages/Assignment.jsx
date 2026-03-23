import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignments } from '../services/api';

function AssignmentPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  async function loadAssignment() {
    try {
      const data = await getAssignments();

      // 🔥 find correct assignment
      const found = data.find(a => String(a.id) === String(id));

      setAssignment(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading assignment...</div>;

  if (!assignment) return <div>Assignment not found</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{assignment.title}</h2>
      <p>{assignment.description}</p>

      <h3>Sample Table:</h3>
      {assignment.sampleTables.map((table, index) => (
        <div key={index}>
          <h4>{table.tableName}</h4>
          <table border="1" cellPadding="5">
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
  );
}

export default AssignmentPage;
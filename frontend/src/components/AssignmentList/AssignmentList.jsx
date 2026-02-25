import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssignments } from '../../services/api.js';
import './AssignmentList.scss';

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (err) {
      setError('Failed to load assignments: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="assignment-list">
      <header className="assignment-list__header">
        <h1>CipherSQLStudio</h1>
        <p>Practice SQL with interactive assignments</p>
      </header>
      
      <div className="assignment-list__grid">
        {assignments.map((assignment) => (
          <Link 
            key={assignment._id} 
            to={`/assignment/${assignment._id}`}
            className="assignment-card"
          >
            <div className="assignment-card__header">
              <h3>{assignment.title}</h3>
              <span className={`difficulty difficulty--${assignment.description.toLowerCase()}`}>
                {assignment.description}
              </span>
            </div>
            <p className="assignment-card__question">{assignment.question}</p>
            <div className="assignment-card__meta">
              {assignment.sampleTables?.length || 0} table{assignment.sampleTables?.length !== 1 ? 's' : ''}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AssignmentList;
// Use proxy in dev, or full URL in production
const API_URL = import.meta.env.VITE_API_URL || '';

async function fetchApi(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  console.log('Fetching:', url);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  
  return response.json();
}

export function getAssignments() {
  return fetchApi('/api/assignments');
}

export function getAssignment(id) {
  return fetchApi(`/api/assignments/${id}`);
}

export function executeQuery(assignmentId, query, sessionId) {
  return fetchApi('/api/execute', {
    method: 'POST',
    body: JSON.stringify({ assignmentId, query, sessionId })
  });
}

export function getHint(assignmentId, query, errorMessage) {
  return fetchApi('/api/hints', {
    method: 'POST',
    body: JSON.stringify({ assignmentId, query, errorMessage })
  });
}

export function registerUser(email, password) {
  return fetchApi('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function loginUser(email, password) {
  return fetchApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}
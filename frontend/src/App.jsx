import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Assignment from './pages/Assignment.jsx';
import './styles/main.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignment/:id" element={<Assignment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
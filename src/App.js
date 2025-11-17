import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlantDashboard from './pages/PlantDashboard';
import PlantDetails from './pages/PlantDetails';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<PlantDashboard />} />
          <Route path="/plant/:plantId" element={<PlantDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

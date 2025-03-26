import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './landingpage';
import DataTable from './table';
import Graphs from './graphs';
import Solutions from './solutions';
import Clusters from './clusters';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/table" element={<DataTable />} />
      <Route path="/graphs" element={<Graphs />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/clusters" element={<Clusters />} />
    </Routes>
  );
}

export default App;
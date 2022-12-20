import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage';
import { SchedulerPage } from './pages/Scheduler/SchedulerPage';

export function AppRoutes(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/scheduler" element={<SchedulerPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

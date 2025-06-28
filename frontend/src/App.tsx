//import { useState } from 'react'
import './App.css'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogoPage from './component/LogoPage';
import Information from './component/patient/Information';
import Login from './component/doctor/Login';
import Certification from './component/patient/Certification';
import Confirmation from './component/patient/Confirmation';
import StartChat from './component/patient/Chat';
import PatientList from './component/doctor/PatientList';
import Reservation from './component/doctor/Reservation';
import React, { useState } from "react";
import PatientDetail from './component/doctor/PatientDetail';
import Calender from './component/doctor/Calender';

function App() {
  const [appointment, setAppointment] = useState({
    date: "2024-06-30",
    time: "11:30",
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogoPage />} />
        <Route path="/patient/info" element={<Information />} />
        <Route path="/doctor/login" element={<Login />} />
        <Route path="/patient/certification" element={<Certification />} /> 
        <Route path="/patient/confirmation" element={<Confirmation />} />
        <Route path="/patient/start-chat" element={<StartChat />} />
        <Route path="/doctor/patient-list" element={<PatientList appointment={appointment} />} />
        <Route path="/doctor/reservation" element={<Reservation appointment={appointment} setAppointment={setAppointment} />} />
        <Route path="/doctor/patient-detail" element={<PatientDetail />} />
        <Route path="/doctor/calender" element={<Calender />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

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
import { useState } from "react";
import PatientDetail from './component/doctor/PatientDetail';
import Calender from './component/doctor/Calender';
import { Toaster } from 'sonner';
import Setting from './component/doctor/Setting';
import { dummyPatients } from './component/Patient';


function App() {
  const [_, setAppointment] = useState({
    date: "2024-06-30",
    time: "11:30",
  });
  const [patients] = useState(dummyPatients);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<LogoPage />} />
        <Route path="/patient/info" element={<Information />} />
        <Route path="/doctor/login" element={<Login />} />
        <Route path="/patient/certification" element={<Certification />} /> 
        <Route path="/patient/confirmation" element={<Confirmation />} />
        <Route path="/patient/start-chat" element={<StartChat />} />
        <Route path="/doctor/patient-list" element={<PatientList patients={patients} />} />
        <Route path="/doctor/reservation" element={<Reservation setAppointment={setAppointment} />} />
        <Route path="/doctor/patient-detail/:id" element={<PatientDetail />} />
        <Route path="/doctor/calender" element={<Calender />} />
        <Route path="/doctor/setting" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

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
import { dummyPatients } from './types/Patient';
import { showAlert } from './component/doctor/RedAlert';
import { useEffect } from 'react';


function App() {
  const [patients, setPatients] = useState(dummyPatients);

  const handleUpdateReservation = (id: number, reservation: { date: string, time: string }) => {
    setPatients(prev =>
      prev.map(p => p.id === id ? { ...p, reservation } : p)
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 중이 아니고, 'r' 키(소문자)일 때만 실행
      const active = document.activeElement;
      const isInput =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);

      if (!isInput && e.key === "r") {
        showAlert({
          title: "의식 저하",
          description: "6시간 전 발생, 서서히 진행",
          patientName: "송원영",
          age: 22,
          gender: "F",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        <Route path="/doctor/reservation/:id" element={<Reservation onUpdateReservation={handleUpdateReservation} />} />
        <Route path="/doctor/patient-detail/:id" element={<PatientDetail  onUpdateReservation={handleUpdateReservation} />} />
        <Route path="/doctor/calender" element={<Calender />} />
        <Route path="/doctor/setting" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

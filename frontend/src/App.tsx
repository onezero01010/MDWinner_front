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
// Patient 타입 정의
type Patient = {
  id: number;
  name: string;
  age: string;
  gender: string;
  diagnosis: string;
  "recent-visit": string;
  reservation: { date: string; time: string };
  cc: string;
  "red-flag": string;
  read: boolean;
  emergency: 0 | 1 | 2; // 0: 기타, 1: 경증, 2: 응급
};

const dummyPatients: Patient[] = [
  // emergency: 2 (응급)
  {
    id: 1,
    name: "송원영",
    age: "22",
    gender: "F",
    diagnosis: "퇴행성 관절염",
    "recent-visit": "6/25 (화)",
    reservation: { date: "2024-06-26", time: "08:00 PM" },
    cc: "무릎 통증, 열감",
    "red-flag": "의식 저하",
    read: false,
    emergency: 2,
  },
  {
    id: 2,
    name: "박민수",
    age: "45",
    gender: "M",
    diagnosis: "심근경색",
    "recent-visit": "6/24 (월)",
    reservation: { date: "2024-06-27", time: "09:00 AM" },
    cc: "가슴 통증, 호흡 곤란",
    "red-flag": "흉통 지속",
    read: false,
    emergency: 2,
  },
  {
    id: 3,
    name: "최지현",
    age: "31",
    gender: "F",
    diagnosis: "뇌졸중",
    "recent-visit": "6/23 (일)",
    reservation: { date: "2024-06-28", time: "01:00 PM" },
    cc: "언어 장애, 마비",
    "red-flag": "의식 저하",
    read: true,
    emergency: 2,
  },
  {
    id: 4,
    name: "이준호",
    age: "60",
    gender: "M",
    diagnosis: "패혈증",
    "recent-visit": "6/22 (토)",
    reservation: { date: "2024-06-29", time: "03:00 PM" },
    cc: "고열, 저혈압",
    "red-flag": "쇼크",
    read: false,
    emergency: 2,
  },
  // emergency: 1 (경증)
  {
    id: 5,
    name: "김철수",
    age: "35",
    gender: "M",
    diagnosis: "요통",
    "recent-visit": "6/20 (목)",
    reservation: { date: "2024-06-27", time: "10:00 AM" },
    cc: "허리 통증",
    "red-flag": "",
    read: true,
    emergency: 1,
  },
  {
    id: 6,
    name: "박영희",
    age: "28",
    gender: "F",
    diagnosis: "감기",
    "recent-visit": "6/19 (수)",
    reservation: { date: "2024-06-28", time: "11:00 AM" },
    cc: "기침, 콧물",
    "red-flag": "",
    read: false,
    emergency: 1,
  },
  {
    id: 7,
    name: "정우성",
    age: "40",
    gender: "M",
    diagnosis: "근육통",
    "recent-visit": "6/18 (화)",
    reservation: { date: "2024-06-29", time: "04:00 PM" },
    cc: "팔 통증",
    "red-flag": "",
    read: false,
    emergency: 1,
  },
  {
    id: 8,
    name: "한지민",
    age: "33",
    gender: "F",
    diagnosis: "피로",
    "recent-visit": "6/17 (월)",
    reservation: { date: "2024-06-30", time: "09:30 AM" },
    cc: "무기력",
    "red-flag": "",
    read: true,
    emergency: 1,
  },
  // emergency: 0 (기타)
  {
    id: 9,
    name: "이영희",
    age: "29",
    gender: "F",
    diagnosis: "고혈압",
    "recent-visit": "6/22 (토)",
    reservation: { date: "2024-06-28", time: "02:00 PM" },
    cc: "두통, 어지러움",
    "red-flag": "혈압 200 이상",
    read: false,
    emergency: 0,
  },
  {
    id: 10,
    name: "최민호",
    age: "50",
    gender: "M",
    diagnosis: "당뇨",
    "recent-visit": "6/15 (토)",
    reservation: { date: "2024-07-01", time: "10:00 AM" },
    cc: "다뇨, 갈증",
    "red-flag": "",
    read: true,
    emergency: 0,
  },
  {
    id: 11,
    name: "김수현",
    age: "38",
    gender: "F",
    diagnosis: "비염",
    "recent-visit": "6/14 (금)",
    reservation: { date: "2024-07-02", time: "11:00 AM" },
    cc: "코막힘",
    "red-flag": "",
    read: false,
    emergency: 0,
  },
  {
    id: 12,
    name: "오세훈",
    age: "44",
    gender: "M",
    diagnosis: "피부염",
    "recent-visit": "6/13 (목)",
    reservation: { date: "2024-07-03", time: "01:00 PM" },
    cc: "가려움",
    "red-flag": "",
    read: true,
    emergency: 0,
  },
];

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
        <Route path="/doctor/patient-detail" element={<PatientDetail />} />
        <Route path="/doctor/calender" element={<Calender />} />
        <Route path="/doctor/setting" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Star, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

// 더미 데이터
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

export default function PatientListPage({
  patients = dummyPatients,
}: {
  patients?: Patient[];
}) {
  const [patientList, setPatientList] = useState<Patient[]>(patients);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tab, setTab] = useState<"emergency" | "warning" | "etc">("emergency");
  const navigate = useNavigate();

  // 읽음 처리: read만 true로 변경
  const handleRead = (idToRead: number) => {
    setPatientList((prev) =>
      prev.map((p) =>
        p.id === idToRead ? { ...p, read: true } : p
      )
    );
  };

  // 탭에 따라 필터링
  const filtered = patientList
    .filter((p) =>
      tab === "emergency"
        ? p.emergency === 2
        : tab === "warning"
        ? p.emergency === 1
        : p.emergency === 0
    )
    // 읽지 않은 카드가 위로 오도록 정렬
    .sort((a, b) => Number(a.read) - Number(b.read));

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white shadow flex items-center gap-2">
        <img src="/LogoName.svg" className="mt-2 h-10" alt="logo" />
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="emergency"
        value={tab}
        onValueChange={v => setTab(v as "emergency" | "warning" | "etc")}
        className="bg-white px-4 pt-4"
      >
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="emergency">
            <span className="flex items-center gap-1">
              🚨응급 <Badge className="bg-red-600 text-white">{patientList.filter(p => p.emergency === 2 && !p.read).length}</Badge>
            </span>
          </TabsTrigger>
          <TabsTrigger value="warning">
            <span className="flex items-center gap-1">
              ⚠️경증 <Badge className="bg-yellow-600 text-white">{patientList.filter(p => p.emergency === 1 && !p.read).length}</Badge>
            </span>
          </TabsTrigger>
          <TabsTrigger value="etc">
            기타
            <Badge className="bg-gray-400 text-white ml-1">{patientList.filter(p => p.emergency === 0 && !p.read).length}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* List */}
      <ScrollArea className="flex-1 px-4 py-2">
        {filtered.map((patient, _) => (
          <Card
            key={patient.id}
            className={`mb-3 relative ml-1 mt-1 transition-all duration-300`}
            onClick={() =>
              setSelectedId(selectedId === patient.id ? null : patient.id)
            }
          >
            {/* read가 false인 경우에만 빨간 점 표시 */}
            {!patient.read && (
              <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white z-10" />
            )}
            <CardContent className="p-4 pb-0">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">
                    {patient.name} ({patient.age}/{patient.gender})
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {patient.diagnosis}
                  </p>
                  <p className="text-xs">
                    <span className="text-darkgray">최근 진단</span>{" "}
                    {patient["recent-visit"]} <br />
                    <span className="text-darkgray">진료 예정</span>{" "}
                    {patient.reservation.date} {patient.reservation.time}
                  </p>
                  <br />
                </div>
                <div className="text-right">
                  <p className="text-sm">{patient.cc}</p>
                  <p className="text-red-600 font-semibold">
                    {patient["red-flag"]}
                  </p>
                </div>
              </div>
            </CardContent>
            {/* 선택된 카드만 버튼 보이기 */}
            {selectedId === patient.id && (
              <div className="flex w-full border-t mt-2">
                <Button
                  size="lg"
                  variant="default"
                  className="flex-1 rounded-none border-r"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/doctor/patient-detail");
                  }}
                >
                  세부 정보
                </Button>
                <Button
                  size="lg"
                  variant="default"
                  className="flex-1 rounded-none border-r"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRead(patient.id);
                  }}
                  disabled={patient.read}
                >
                  읽음
                </Button>
                <Button
                  size="lg"
                  variant="default"
                  className="flex-1 rounded-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/doctor/reservation");
                  }}
                >
                  예약 변경
                </Button>
              </div>
            )}
          </Card>
        ))}
      </ScrollArea>

      {/* Footer */}
      <div className="bg-white p-2 flex justify-around">
        <div className="flex flex-col items-center text-blue-500">
          <Star size={20} />
          <span className="text-xs">환자 목록</span>
        </div>
        <div
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/doctor/calender")}
        >
          <Calendar size={20} />
          <span className="text-xs">예약 관리</span>
        </div>
        <div
          className="flex flex-col items-center text-gray-500"
          onClick={() => navigate("/doctor/setting")}
        >
          <User size={20} />
          <span className="text-xs">설정</span>
        </div>
      </div>
    </div>
  );
}

// 파일 하단에, patients prop이 없을 때 더미 데이터로 렌더링
// (예시: 개발/테스트용)
export function PatientListPageWithDummy() {
  return <PatientListPage patients={dummyPatients} />;
}

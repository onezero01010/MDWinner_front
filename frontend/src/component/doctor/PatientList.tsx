import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Star, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Patient } from "../Patient";

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
                    navigate(`/doctor/patient-detail/${patient.id}`);
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

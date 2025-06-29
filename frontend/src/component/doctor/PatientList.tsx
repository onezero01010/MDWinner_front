import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Star, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Patient } from "../Patient";
import { dummyPatients } from "../Patient";
import { Flipper, Flipped } from "react-flip-toolkit";

export default function PatientListPage({
  patients = dummyPatients,
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
        <img src="/CAREBOT.svg" className="mt-2 h-10" alt="logo" />
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="emergency"
        value={tab}
        onValueChange={v => setTab(v as "emergency" | "warning" | "etc")}
        className="bg-white px-4 pt-0"
      >
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent shadow-none border-none my-2">
          <TabsTrigger
            value="emergency"
            className={`text-base h-9 bg-transparent shadow-none border-none ${
              tab === "emergency"
                ? "font-bold !bg-[#592DA1] !text-white"
                : "font-normal"
            }`}
          >
            <span className="flex items-center gap-1">
              응급
              {(() => {
                const count = patientList.filter(p => p.emergency === 2 && !p.read).length;
                return count > 0 ? (
                  <Badge
                    className="bg-red-600 text-white hover:bg-red-600 active:bg-red-600 focus:bg-red-600 px-2 py-0.5 min-w-5 h-5 flex items-center justify-center text-[13px] font-semibold"
                    style={{ lineHeight: "1.1", height: "20px", minWidth: "20px", padding: "0 6px" }}
                  >
                    {count}
                  </Badge>
                ) : null;
              })()}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="warning"
            className={`text-base bg-transparent h-9 shadow-none border-none ${
              tab === "warning"
                ? "font-bold !bg-[#592DA1] !text-white"
                : "font-normal"
            }`}
          >
            <span className="flex items-center gap-1">
              경증
              {(() => {
                const count = patientList.filter(p => p.emergency === 1 && !p.read).length;
                return count > 0 ? (
                  <Badge
                    className="bg-yellow-600 text-white hover:bg-yellow-600 active:bg-yellow-600 focus:bg-yellow-600 px-2 py-0.5 min-w-5 h-5 flex items-center justify-center text-[13px] font-semibold"
                    style={{ lineHeight: "1.1", height: "20px", minWidth: "20px", padding: "0 6px" }}
                  >
                    {count}
                  </Badge>
                ) : null;
              })()}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="etc"
            className={`text-base bg-transparent h-9 shadow-none border-none ${
              tab === "etc"
                ? "font-bold !bg-[#592DA1] !text-white"
                : "font-normal"
            }`}
          >
            기타
            {(() => {
              const count = patientList.filter(p => p.emergency === 0 && !p.read).length;
              return count > 0 ? (
                <Badge
                  className="bg-darkgray text-white ml-1 hover:bg-darkgray active:bg-darkgray focus:bg-darkgray px-2 py-0.5 min-w-5 h-5 flex items-center justify-center text-[13px] font-semibold"
                  style={{ lineHeight: "1.1", height: "20px", minWidth: "20px", padding: "0 6px" }}
                >
                  {count}
                </Badge>
              ) : null;
            })()}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* List */}
      <ScrollArea className="flex-1 px-4 py-2">
        <Flipper flipKey={filtered.map(p => p.id + (p.read ? "-read" : "-unread")).join(",")}>
          {filtered.map((patient, _) => (
            <Flipped key={patient.id} flipId={patient.id}>
              <div>
                <Card
                  className={
                    `mb-3 relative ml-1 mt-1 transition-all duration-300 ease-in-out` +
                    (selectedId === patient.id
                      ? " shadow-lg scale-[1.01] bg-violet-50"
                      : " bg-white")
                  }
                  style={{
                    minHeight: selectedId === patient.id ? 160 : 120,
                    maxHeight: selectedId === patient.id ? 260 : 140,
                    transition: "min-height 0.3s, max-height 0.3s, box-shadow 0.3s, background 0.3s, transform 0.3s",
                  }}
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
                        <div>
                          <span className="font-bold">{patient.name}</span>
                          <span className="ml-1">{patient.age}/{patient.gender}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {patient.diagnosis}
                        </p>
                        <p className="text-xs">
                          <span className="text-darkgray">최근 진단</span>{" "}
                          {patient["recent-visit"]} <br />
                          <span className="text-darkgray">진료 예정</span>{" "}
                          {patient.reservation.date} {patient.reservation.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{patient.cc}</p>
                        <p className="text-red-600 font-semibold">
                          {patient["red-flag"]}
                        </p>
                      </div>
                    </div>
                    {/* 선택된 카드만 버튼 보이기 */}
                    <div
                      className={`flex gap-2 mt-3 mb-1 overflow-hidden transition-all duration-300 ease-in-out`}
                      style={{
                        maxHeight: selectedId === patient.id ? 48 : 0,
                        opacity: selectedId === patient.id ? 1 : 0,
                        pointerEvents: selectedId === patient.id ? "auto" : "none",
                        transition:
                          "max-height 0.3s, opacity 0.2s",
                      }}
                    >
                      {selectedId === patient.id && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            className="flex-1 min-w-0 px-2 rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/doctor/patient-detail/${patient.id}`);
                            }}
                          >
                            세부 정보
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="flex-1 min-w-0 px-2 rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRead(patient.id);
                            }}
                            disabled={patient.read}
                          >
                            읽음
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="flex-1 min-w-0 px-2 rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/doctor/reservation");
                            }}
                          >
                            예약 변경
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Flipped>
          ))}
        </Flipper>
      </ScrollArea>

      {/* Footer */}
      <div className="bg-white p-2 flex justify-around">
        <div className="flex flex-col items-center text-[#8E34FB]">
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

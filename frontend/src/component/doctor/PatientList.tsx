import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Star, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PatientListPage({ appointment }: { appointment: { date: string, time: string } }) {
  // 카드 목록을 state로 관리
  const [cards, setCards] = useState([1, 2, 3, 4, 5, 6]);
  const [removing, setRemoving] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleRemove = (idxToRemove: number) => {
    setRemoving((prev) => [...prev, idxToRemove]);
    setTimeout(() => {
      setCards((prev) => prev.filter((_, idx) => idx !== idxToRemove));
      setRemoving((prev) => prev.filter((i) => i !== idxToRemove));
    }, 300); // 300ms = duration-300
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white shadow flex items-center gap-2">
        <img src="/LogoName.svg" className="mt-2 h-10" alt="logo" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="emergency" className="bg-white px-4 pt-4">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="emergency">
            <span className="flex items-center gap-1">🚨응급 <Badge className="bg-red-600 text-white">1</Badge></span>
          </TabsTrigger>
          <TabsTrigger value="warning">
            <span className="flex items-center gap-1">⚠️경증 <Badge className="bg-yellow-600 text-white">1</Badge></span>
          </TabsTrigger>
          <TabsTrigger value="etc">기타</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* List */}
      <ScrollArea className="flex-1 px-4 py-2">
        {cards.map((item, idx) => (
          <Card
            key={item}
            className={`mb-3 relative ml-1 mt-1 transition-all duration-300 ${
              removing.includes(idx) ? 'opacity-0 -mb-10' : ''
            }`}
            onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
          >
            {/* 첫 번째 카드에만 빨간 점 표시 */}
            {idx === 0 && (
              <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white z-10" />
            )}
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">송원영 (22/F)</p>
                  <p className="text-sm text-gray-500 mb-2">퇴행성 관절염</p>
                  <p className="text-xs">
                    <span className="text-darkgray">최근 진단</span> 6/25 (화) <br />
                    <span className="text-darkgray">진료 예정</span> {appointment.date} {appointment.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">무릎 통증, 열감</p>
                  <p className="text-red-600 font-semibold">Red Flag Sign</p>
                </div>
              </div>
              {/* 선택된 카드만 버튼 보이기 */}
              {selectedIndex === idx && (
                <div className="mt-2 flex gap-2 w-full justify-end">
                  <Button size="sm" variant="outline" className="text-xs">세부 정보</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={(e) => { e.stopPropagation(); handleRemove(idx); }}
                  >
                    읽음 처리
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={(e) => { e.stopPropagation(); navigate('/doctor/reservation'); }}
                  >
                    예약 변경
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </ScrollArea>

      {/* Footer */}
      <div className="bg-white p-2 flex justify-around">
        <div className="flex flex-col items-center text-blue-500">
          <Star size={20} />
          <span className="text-xs">환자 목록</span>
        </div>
        <div className="flex flex-col items-center text-gray-500 cursor-pointer" onClick={() => navigate('/doctor/reservation')}>
          <Calendar size={20} />
          <span className="text-xs">예약 관리</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <User size={20} />
          <span className="text-xs">설정</span>
        </div>
      </div>
    </div>
  );
}

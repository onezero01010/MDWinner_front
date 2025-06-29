import { useState } from "react"
import { Calendar, Star, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Calendar as CalendarIcon } from "../../components/ui/calendar"
import { dummyPatients } from "../Patient"
import { Card, CardContent } from "../../components/ui/card"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export default function Calender() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const navigate = useNavigate()
  // 날짜를 YYYY-MM-DD로 포맷
  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : ""
  
  console.log(selectedDateStr)
  // 해당 날짜의 예약 환자 필터링
  const patientsForDate = dummyPatients.filter(
    p => p.reservation.date.includes(selectedDateStr)
  )

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">예약 캘린더</h2>
      <CalendarIcon
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md w-full mb-6"
        locale={ko}
      />

      {/* 선택된 날짜가 있을 때만 카드 표시 */}
      {selectedDate && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            {format(selectedDate, "yyyy년 MM월 dd일 (E)", { locale: ko })} 예약 환자
          </h3>
          {patientsForDate.length === 0 ? (
            <div className="text-gray-400 text-center py-8">예약된 환자가 없습니다.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {patientsForDate.map(patient => (
                <Card key={patient.id} className="shadow-md border border-gray-200">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">{patient.name}</span>
                      <span className="text-xs text-gray-500">{patient.reservation.time}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {patient.diagnosis}
                    </div>
                    <div className="text-xs text-gray-400">
                      최근 진단: {patient["recent-visit"]}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t z-30">
        <div className="p-2 flex justify-around">
          <div className="flex flex-col items-center text-gray-500" onClick={() => navigate('/doctor/patient-list')}>
            <Star size={20} />
            <span className="text-xs">환자 목록</span>
          </div>
          <div
            className="flex flex-col items-center text-[#8E34FB]"
            onClick={() => navigate('/doctor/calender')}
          >
            <Calendar size={20} />
            <span className="text-xs">예약 관리</span>
          </div>
          <div
            className="flex flex-col items-center text-gray-500"
            onClick={() => navigate('/doctor/setting')}
         >
            <User size={20} />
            <span className="text-xs">설정</span>
          </div>
        </div>
      </div>
    </div>
  )
}

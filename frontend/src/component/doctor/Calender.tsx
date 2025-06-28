import { useState } from "react"
import { Calendar, Star, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Calendar as CalendarIcon } from "../../components/ui/calendar"

export default function Calender() {
  const [date, setDate] = useState<Date | undefined>(new Date("2024-06-26"))
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center px-6 py-8 space-y-6 max-w-sm mx-auto bg-white rounded-xl pb-24">
      <h2 className="text-lg font-semibold">예약 관리</h2>

      <CalendarIcon
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md w-full"
      />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t z-30">
        <div className="p-2 flex justify-around">
          <div className="flex flex-col items-center text-gray-500" onClick={() => navigate('/doctor/patient-list')}>
            <Star size={20} />
            <span className="text-xs">환자 목록</span>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer text-blue-500"
            onClick={() => navigate('/doctor/calender')}
          >
            <Calendar size={20} />
            <span className="text-xs">예약 관리</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <User size={20} />
            <span className="text-xs">설정</span>
          </div>
        </div>
      </div>
    </div>
  )
}

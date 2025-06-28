import React, { useState, useRef, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import Picker from 'react-mobile-picker';
import { useNavigate } from "react-router-dom"

export default function AppointmentEditor({ appointment, setAppointment }: { appointment: { date: string, time: string }, setAppointment: (appointment: { date: string, time: string }) => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date("2024-06-26"))
  const [value, setValue] = useState({
    hour: '08',
    minute: '00',
    ampm: 'PM'
  });
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  const handleChange = () => {
    // 날짜 포맷: YYYY-MM-DD
    const dateStr = date ? date.toISOString().slice(0, 10) : "";
    // 시간 포맷: HH:MM AM/PM
    const timeStr = `${value.hour}:${value.minute} ${value.ampm}`;
    setAppointment({ date: dateStr, time: timeStr });
    navigate("/doctor/patient-list");
  };

  // 바깥 클릭 시 Picker 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="flex flex-col items-center px-6 py-8 space-y-6 max-w-sm mx-auto bg-white rounded-xl pb-24">
      <h2 className="text-lg font-semibold">예약 변경</h2>

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md w-full"
      />

      {/* 시간 표시 영역 */}
      <div className="w-full">
        <div
          className="flex items-center justify-between border rounded-md px-4 py-2 bg-gray-50 cursor-pointer"
          onClick={() => setShowPicker((prev) => !prev)}
        >
          <span className="text-gray-700">시간</span>
          <span className="bg-gray-200 rounded px-3 py-1 text-gray-800">{`${value.hour}:${value.minute} ${value.ampm}`}</span>
        </div>
        {/* Picker는 클릭 시에만 보임 */}
        {showPicker && (
          <div ref={pickerRef} className="mt-2 flex justify-end">
            <Picker
              value={value}
              onChange={setValue}
              className="flex gap-12 bg-white border rounded-md shadow-lg p-2"
            >
              <Picker.Column name="hour">
                {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                  <Picker.Item key={h} value={h} className="text-1xl">{h}</Picker.Item>
                ))}
              </Picker.Column>
              <Picker.Column name="minute">
                {['00','15','30','45'].map(m => (
                  <Picker.Item key={m} value={m} className="text-1xl">{m}</Picker.Item>
                ))}
              </Picker.Column>
              <Picker.Column name="ampm">
                {['AM','PM'].map(a => (
                  <Picker.Item key={a} value={a} className="text-1xl">{a}</Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white px-6 pb-4 flex justify-between gap-4 z-10">
        <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleChange}>
          변경
        </Button>
        <Button variant="outline" className="w-full mb-2" onClick={() => navigate('/doctor/patient-list')}>취소</Button>
      </div>
    </div>
  )
}

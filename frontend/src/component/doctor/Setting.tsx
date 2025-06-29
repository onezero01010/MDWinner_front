import { Switch } from "../../components/ui/switch";
import { Calendar, Star, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";

export default function Setting() {
    const navigate = useNavigate();
    return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-8">
      {/* 상단 로고 */}
      <div className="mb-10">
        <div className="w-24 h-24 bg-[#7B3AED] rounded-[32px] flex items-center justify-center relative">
          <svg width="48" height="48" viewBox="0 0 48 48" className="absolute top-6 left-6">
            <path d="M16 20c0-2.21 1.79-4 4-4s4 1.79 4 4" fill="white"/>
            <path d="M28 20c0-2.21 1.79-4 4-4s4 1.79 4 4" fill="white"/>
          </svg>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="w-full max-w-xs flex flex-col gap-6">
        <div>
          <div className="text-sm font-medium mb-2">알림 설정</div>
          <Select defaultValue="응급 환자만">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="응급 환자만" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="모든 환자">모든 환자</SelectItem>
              <SelectItem value="응급 환자만">응급 환자만</SelectItem>
              <SelectItem value="알림 끄기">알림 끄기</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 진동/소리 스위치 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">진동</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">소리</span>
            <Switch defaultChecked />
          </div>
        </div>

        {/* AI 자유도 설정 */}
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">AI 자유도 설정</div>
          <Select defaultValue="스스로 판단하기">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="스스로 판단하기" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="스스로 판단하기">스스로 판단하기</SelectItem>
              <SelectItem value="진단이 필요하면 물어보기">진단이 필요하면 물어보기</SelectItem>
              <SelectItem value="정한 내용만 말하기">정한 내용만 말하기</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t z-30">
        <div className="p-2 flex justify-around">
          <div className="flex flex-col items-center text-gray-500" onClick={() => navigate('/doctor/patient-list')}>
            <Star size={20} />
            <span className="text-xs">환자 목록</span>
          </div>
          <div
            className="flex flex-col items-center text-gray-500"
            onClick={() => navigate('/doctor/calender')}
          >
            <Calendar size={20} />
            <span className="text-xs">예약 관리</span>
          </div>
          <div
            className="flex flex-col items-center text-[#8E34FB]"
            onClick={() => navigate('/doctor/setting')}
         >
            <User size={20} />
            <span className="text-xs">설정</span>
          </div>
        </div>
      </div>
    </div>
  );
}

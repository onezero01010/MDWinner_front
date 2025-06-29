// import React from "react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";

interface RedAlertProps {
  source?: string; // 출처 (예: EVERYDAYCARE)
  status?: string; // 예: "응급"
  statusColor?: string; // 예: "bg-red-500"
  title: string; // 예: "의식 저하"
  description: string; // 예: "6시간 전 발생, 서서히 진행"
  patientName: string; // 예: "송원영"
  age: number; // 예: 22
  gender: string; // 예: "F"
}

// sonner 토스트를 띄우는 함수로 export
export function showAlert({
  status = "응급",
  statusColor = "bg-red-500",
  title,
  description,
  patientName,
  age,
  gender,
}: RedAlertProps) {
  toast.custom((t) => (
    <div
      className="w-full max-w-96 p-4 bg-white rounded shadow border mx-auto relative cursor-pointer"
      onClick={() => {
        console.log("알림 클릭");
      }}
    >
      {/* 상단 flex 레이아웃 */}
      <div className="flex items-start justify-between gap-4">
        {/* 왼쪽: 뱃지, 제목, 설명 수직 배치 */}
        <div className="flex flex-col items-start flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              className={`text-white font-bold px-3 py-1 rounded ${statusColor} hover:${statusColor} active:${statusColor} focus:${statusColor}`}
              style={{ backgroundColor: undefined }}
            >
              {status}
            </Badge>
            <span className="font-bold text-lg truncate">{title}</span>
          </div>
          <div className="flex items-center gap-2 w-full mb-0.5">
            <span className="text-sm text-gray-700 font-medium text-right whitespace-nowrap">
              {patientName} <span className="text-xs text-gray-500">({age}/{gender})</span>
            </span>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm text-gray-400 truncate flex-1">{description}</span>
          </div>
        </div>
        {/* 오른쪽: x버튼만 */}
        <button
          className="text-gray-400 hover:text-gray-700 text-lg font-bold mt-0.5 ml-4 self-start"
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(t.id);
          }}
          aria-label="닫기"
          tabIndex={0}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  ));
}

// 기존 컴포넌트는 필요 없으면 삭제해도 됩니다.
export default function RedAlert() {
  return null;
}



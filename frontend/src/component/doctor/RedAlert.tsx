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
  source = "EVERYDAYCARE",
  status = "응급",
  statusColor = "bg-red-500",
  title,
  description,
  patientName,
  age,
  gender,
}: RedAlertProps) {
  toast.custom((_) => (
    <div className="w-full max-w-96 p-4 flex flex-col gap-2 bg-white rounded shadow border mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-violet-600 font-bold text-xs flex items-center gap-1">
            <span role="img" aria-label="care" className="text-lg">🩺</span>
            {source}
          </span>
        </div>
        <Badge
          className={`text-white font-bold px-3 py-1 rounded ${statusColor} hover:${statusColor} active:${statusColor} focus:${statusColor}`}
          style={{ backgroundColor: undefined }}
        >
          {status}
        </Badge>
      </div>
      <div className="mt-1">
        <div className="font-bold text-lg">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <div className="flex justify-end text-sm text-gray-700 font-medium">
        {patientName} ({age}/{gender})
      </div>
    </div>
  ));
}

// 기존 컴포넌트는 필요 없으면 삭제해도 됩니다.
export default function RedAlert() {
  return null;
}


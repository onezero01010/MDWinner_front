import React from "react";
import { Card, CardContent } from "../../components/ui/card";
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

export function RedAlert({
  source = "EVERYDAYCARE",
  status = "응급",
  statusColor = "bg-red-500",
  title,
  description,
  patientName,
  age,
  gender,
}: RedAlertProps) {
  return (
    <Card className="w-full p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* 출처 아이콘/텍스트 */}
          <span className="text-violet-600 font-bold text-xs flex items-center gap-1">
            {/* 아이콘 대체: 🩺 */}
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
    </Card>
  );
}

export default RedAlert;

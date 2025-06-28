import React, { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import RedAlert from "./RedAlert";
import ActionModal from "./ActionModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { useNavigate } from "react-router-dom";

const patient = {
  name: "송원영",
  age: 22,
  gender: "F",
  height: 123.45,
  weight: 999.99,
  bmi: 99.99,
  birth: "2002-01-01", // 생년월일 예시
};

export default function PatientDetail() {
    const [actionOpen, setActionOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    const handleAction = () => {
        setActionOpen(true);
    };

    const handleTooltipClick = () => {
        setTooltipOpen(true);
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = setTimeout(() => setTooltipOpen(false), 2000); // 2초 후 자동 닫힘
    };

    // 권장 조치 예시
    const actions = [
        "수액 투여",
        "산소 공급",
        "의식 상태 모니터링",
        "응급실 이송"
    ];

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="border-b pb-2">
        {/* Top: Back + Patient Info */}
        <div className="flex items-center space-x-3 px-4 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/doctor/patient-list')}
          >
            <ArrowLeft />
          </Button>
          <div>
            <TooltipProvider>
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                  <div
                    className="font-bold text-lg cursor-pointer inline-block"
                    tabIndex={0}
                    onClick={handleTooltipClick}
                  >
                    {patient.name} ({patient.age}/{patient.gender})
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <span>생년월일: {patient.birth}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-xs text-gray-500">
              {patient.height} cm, {patient.weight} kg, BMI {patient.bmi} kg/m<sup>2</sup>
            </div>
          </div>
        </div>
        {/* Tabs -> Full Buttons */}
        <div className="flex mt-4 gap-2 px-4">
          <Button className="flex-1" variant="default" onClick={handleAction}>권장 조치</Button>
          <Button className="flex-1" variant="secondary">예약 변경</Button>
          <Button className="flex-1" variant="secondary">대화 기록</Button>
        </div>
      </div>
      {/* Accordion */}
      <div className="p-4">
        <Accordion type="multiple" className="w-full space-y-2">
          <AccordionItem value="symptom">
            <AccordionTrigger>증상</AccordionTrigger>
            <AccordionContent>
              <RedAlert
                title="의식 저하"
                description="6시간 전 발생, 서서히 진행"
                patientName={patient.name}
                age={patient.age}
                gender="F"
              />
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>증상 발생 시점</li>
                <li>증상 위치</li>
                <li>증상 지속 시간</li>
                <li>경과 과정</li>
                <li>이전 증상 발생 여부</li>
                <li>증상 특성(색, 양, 세기)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="history">
            <AccordionTrigger>현병력</AccordionTrigger>
            <AccordionContent>
              {/* 현병력 내용 */}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="review">
            <AccordionTrigger>계통적 문진</AccordionTrigger>
            <AccordionContent>
              {/* 계통적 문진 내용 */}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ai">
            <AccordionTrigger>AI 분석</AccordionTrigger>
            <AccordionContent>
              {/* AI 분석 내용 */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <ActionModal
        open={actionOpen}
        onOpenChange={setActionOpen}
        actions={actions}
        // onSubmit={(selected, etc) => { ... }}
      />
    </div>
  );
}

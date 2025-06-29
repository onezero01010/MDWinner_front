import { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import ActionModal from "./ActionModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import Reservation from "./Reservation";
import ChatLog from "./ChatLog";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { dummyPatients } from "../Patient";
import type { Patient } from "../Patient";

type ChatMessage = {
  question: string;
  answer: string;
};

export default function PatientDetail({ onUpdateReservation }: { onUpdateReservation: (id: number) => void }) {
  // const { id } = useParams<{ id: string }>();const { id } = useParams();
    const { id } = useParams();
    console.log("받은 id:", id);
    const patient = dummyPatients.find(p => p.id === Number(id));
    const [chatLog] = useState<ChatMessage[]>([ 
        {question: "안녕하세요", answer: "네, 안녕하세요!"}
    ]);
    const [actionOpen, setActionOpen] = useState(false);
    // const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tab, setTab] = useState("info");
    // 예약 정보 상태 추가
    // const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    // const handleAction = () => {
    //     setActionOpen(true);
    // };

    // const handleTooltipClick = () => {
    //     setTooltipOpen(true);
    //     if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    //     tooltipTimeout.current = setTimeout(() => setTooltipOpen(false), 2000); // 2초 후 자동 닫힘
    // };

    const handleRedAlert = () => {
        navigate('/doctor/patient-list')
        // showAlert({
        //     title: "의식 저하",
        //     description: "6시간 전 발생, 서서히 진행",
        //     patientName: patient.name,
        //     age: patient.age,
        //     gender: "F"
        // });
    };

    // 권장 조치 예시
    const actions = [
        "수액 투여",
        "산소 공급",
        "의식 상태 모니터링",
        "응급실 이송"
    ];

    if (!patient) {
      return (
        <div className="w-full max-w-md mx-auto bg-white min-h-screen flex items-center justify-center text-gray-500">
          환자 정보를 찾을 수 없습니다.
        </div>
      );
    }

    return (
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          {/* Sticky Header + TabsList */}
          <div className="sticky top-0 z-10 bg-white">
            {/* Top: Back + Patient Info */}
            <div className="flex items-center space-x-3 px-4 pt-4">
              <Button variant="ghost" size="icon" onClick={handleRedAlert}>
                <ArrowLeft />
              </Button>
              <div>
                <div
                        className="font-bold text-lg cursor-pointer inline-block"
                        tabIndex={0}
                      >
                        {patient.name} ({patient.age}/{patient.gender})
                      </div>
                {/* <TooltipProvider>
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
                </TooltipProvider> */}
                <div className="text-xs text-gray-500">
                  {patient.height} cm, {patient.weight} kg, BMI {patient.bmi} kg/m<sup>2</sup>
                </div>
              </div>
            </div>
            {/* TabsList + Divider */}
            <TabsList className="flex mt-4 gap-2 px-4 bg-transparent shadow-none border-none my-2 mt-4">
              <TabsTrigger
                value="info"
                className={`flex-1 text-base h-9 rounded-lg bg-transparent shadow-none border-none transition-all
                  ${tab === "info"
                    ? "font-bold !bg-[#592DA1] !text-white"
                    : "font-normal hover:bg-violet-100"
                  }`}
              >
                환자 정보
              </TabsTrigger>
              <TabsTrigger
                value="reservation"
                className={`flex-1 text-base h-9 rounded-lg bg-transparent shadow-none border-none transition-all
                  ${tab === "reservation"
                    ? "font-bold !bg-[#592DA1] !text-white"
                    : "font-normal hover:bg-violet-100"
                  }`}
              >
                예약 변경
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className={`flex-1 text-base h-9 rounded-lg bg-transparent shadow-none border-none transition-all
                  ${tab === "chat"
                    ? "font-bold !bg-[#592DA1] !text-white"
                    : "font-normal hover:bg-violet-100"
                  }`}
              >
                대화 기록
              </TabsTrigger>
            </TabsList>
            <div className="border-b mt-2" />
          </div>
          {/* Tabs Content */}
          <TabsContent value="info">
            <div className="p-4">
              <Accordion
                type="multiple"
                className="w-full space-y-2"
                defaultValue={["symptom"]}
              >
                <AccordionItem value="symptom">
                  <AccordionTrigger className="text-base font-bold border-b-0 hover:no-underline focus:no-underline">
                    증상
                  </AccordionTrigger>
                  <AccordionContent>
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
                <AccordionItem value="lastorder">
                  <AccordionTrigger className="text-base font-bold border-b-0 hover:no-underline focus:no-underline">
                    최근 처방
                  </AccordionTrigger>
                  <AccordionContent>
                    {/* 최근 처방 내용 */}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="history">
                  <AccordionTrigger className="text-base font-bold border-b-0 hover:no-underline focus:no-underline">
                    현병력
                  </AccordionTrigger>
                  <AccordionContent>
                    {/* 현병력 내용 */}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="warning">
                  <AccordionTrigger className="text-base font-bold border-b-0 hover:no-underline focus:no-underline">
                    주의가 필요한 소견
                  </AccordionTrigger>
                  <AccordionContent>
                    {/* 주의가 필요한 소견 내용 */}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="recommendation">
                  <AccordionTrigger className="text-base font-bold border-b-0 hover:no-underline focus:no-underline">
                    권장 조치
                  </AccordionTrigger>
                  <AccordionContent>
                    {/* 권장 조치 내용 */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          <TabsContent value="reservation">
            <Reservation onUpdateReservation={onUpdateReservation} />
          </TabsContent>
          <TabsContent value="chat">
            <ChatLog externalMessages={chatLog}/>
          </TabsContent>
        </Tabs>
        <ActionModal
          open={actionOpen}
          onOpenChange={setActionOpen}
          actions={actions}
          // onSubmit={(selected, etc) => { ... }}
        />
      </div>
    );
}

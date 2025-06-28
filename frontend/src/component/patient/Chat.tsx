import React, { useState, useRef, useEffect } from 'react';
import './hideScrollbar.css'; // 스크롤바 숨김용 CSS import (없으면 생성)
import { Carousel, CarouselContent, CarouselItem } from "../../components/ui/carousel";
import { CalendarIcon } from 'lucide-react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

type ChatMessage = {
  question: string;
  answer: string;
  imageUrl?: string; // 이미지가 있을 경우
};

const StartChat = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  // 예시: 환자 상태 state (emergency, middle, good)
  const [patientStatus] = useState<'emergency' | 'middle' | 'good'>('good');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      // 임시 답변 예시
      const answer = '이것은 답변입니다.';
      setMessages([...messages, { question: inputValue, answer }]);
      setInputValue('');
    }
  };

  const handleSend = () => {
    if (inputValue.trim() !== "" || file) {
      const newMessage: ChatMessage = {
        question: inputValue,
        answer: "이것은 답변입니다.",
      };
      if (file && file.type.startsWith("image/")) {
        newMessage.imageUrl = URL.createObjectURL(file);
      }
      setMessages([...messages, newMessage]);
      setInputValue("");
      setFile(null); // 미리보기 제거
    }
    inputRef.current?.focus();
  };

  const handleQuickSend = (text: string) => {
    const newMessage: ChatMessage = {
      question: text,
      answer: "이것은 답변입니다.",
    };
    setMessages([...messages, newMessage]);
    setInputValue("");
    setFile(null); // 파일 첨부도 초기화(필요시)
    inputRef.current?.focus();
  };

  // 새 메시지 추가 시 스크롤 하단으로 이동
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <div className="w-full min-h-screen flex flex-col bg-white pt-8 pb-4">
      {/* 상단 로고 + 진행률 바 (고정) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white z-20 pt-8">
        <div className="flex flex-row items-center justify-between w-full px-6">
          <img src="/LogoName.svg" alt="Logo" className="h-10" onClick={() => setMessages([])} style={{ cursor: 'pointer' }} />
          <img src="/Hamburger.svg" alt="Menu" className="h-8 cursor-pointer" onClick={() => setIsMenuOpen(true)} />
        </div>
        {/* 진행률 바 */}
        {messages.length > 0 && (      
          <div className="flex flex-col items-center w-full">
            <div className="w-80 h-2 bg-gray rounded-full mt-8 mb-2 mx-auto">
              <div
                className="h-2 bg-purple rounded-full transition-all duration-300"
                style={{ width: `${Math.min((messages.length * 2) * 10, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-2 text-center w-80 mx-auto mb-2">
              추가 정보를 수집 중입니다.
            </div>
          </div>
        )}
      </div>
      {/* 중앙 안내/채팅 영역 (스크롤) */}
      <div
        ref={chatRef}
        className="flex-1 min-h-0 flex flex-col items-start justify-start w-full pt-4 overflow-y-auto mb-8 mt-2"
        style={{ paddingTop: '120px', paddingBottom: messages.length === 0 ? '120px' : '80px' }}
      >
        {messages.length === 0 ? (
          <>
            <div className="bg-white rounded-xl shadow-lg px-6 py-5 max-w-md w-[90%] text-gray-800 text-base font-medium mb-8 border border-gray text-center mx-auto -mt-10">
              안녕하세요, 송원영님!<br /><br />
              혹시 문제가 있다면 저에게 말씀해주시면 적절한 대응 방법을 알려드릴 수 있어요!
            </div>
            <div className="w-full flex justify-center items-center py-4 mt-6">
              <div className="max-w-full w-full">
              <Carousel>
                <CarouselContent className="gap-4">
                  <CarouselItem className="flex justify-center">
                    <div className="w-80 h-80 bg-lightPurple border border-gray-200 rounded-2xl shadow-xl p-5 flex flex-col justify-between text-center transition hover:shadow-2xl">
                      {/* 날짜와 아이콘 */}
                      <div className="flex items-center justify-center gap-2 text-purple font-semibold text-lg">
                        <CalendarIcon className="w-5 h-5" />
                        <span>6월 25일</span>
                      </div>

                      {/* 질병명 */}
                      <div className="text-xl font-bold text-gray-800 mt-4">
                        퇴행성 관절염
                      </div>

                      {/* 치료 정보 */}
                      <div className="text-base text-gray-600">
                        양측 주사 치료
                      </div>
                    </div>
                  </CarouselItem>

                  <CarouselItem className="flex justify-center">
                    <div className="w-80 h-80 bg-lightPurple border border-gray-200 rounded-2xl shadow-xl p-5 flex flex-col justify-between text-center transition hover:shadow-2xl">
                      <div className="flex items-center justify-center gap-2 text-purple font-semibold text-lg">
                        <CalendarIcon className="w-5 h-5" />
                        <span>6월 20일</span>
                      </div>

                      <div className="text-xl font-bold text-gray-800 mt-4">
                        슬관절염
                      </div>

                      <div className="text-base text-gray-600">
                        비스테로이드성 소염진통제 처방
                      </div>

                    </div>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 w-full max-w-md px-4">
            {messages.map((msg, idx) => (
              <React.Fragment key={idx}>
                {/* 내 메시지(오른쪽, 흰색) */}
                <div className="flex justify-end">
                  <div className="bg-white text-gray-900 rounded-2xl rounded-tr-md px-4 py-2 shadow border border-gray max-w-[70%] flex flex-col items-end">
                    {msg.question}
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="첨부 이미지"
                        className="max-w-[200px] max-h-40 mt-2 rounded-lg border"
                      />
                    )}
                  </div>
                </div>
                {/* 답변(왼쪽, 보라색) */}
                <div className="flex justify-start">
                  <div 
                  className="bg-purple text-white rounded-2xl rounded-tl-md px-4 py-2 shadow max-w-[70%]"
                  ref={idx === messages.length - 1 ? lastMessageRef : null}
                  >
                    {msg.answer}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      {/* 하단 고정 입력창/버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-transparent px-4 pb-4 pt-1 flex flex-col gap-2 z-10">
        {file && (
          <div className="mt-2 flex flex-col items-center">
            <span className="text-sm text-gray-600">{file.name}</span>
            {file.type.startsWith('image/') && (
              <img src={URL.createObjectURL(file)} alt="preview" className="max-h-16 rounded-lg border mt-2" />
            )}
          </div>
        )}
        {messages.length === 0 && (
          <>
            <div className="overflow-x-auto whitespace-nowrap hide-scrollbar">
              <button
                className="inline-block bg-transparent border border-gray rounded-full px-4 py-2 text-sm shadow-sm mx-2"
                onClick={() => handleQuickSend("체온 올리는 법, 열도 동반인가요?")}
              >
                체온 올리는 법, 열도 동반인가요?
              </button>
              <button
                className="inline-block bg-transparent border border-gray rounded-full px-4 py-2 text-sm shadow-sm mx-2"
                onClick={() => handleQuickSend("이런 복약방법은 어떤 것이 있나요?")}
              >
                이런 복약방법은 어떤 것이 있나요?
              </button>
            </div>
          </>
        )}
        <div className="flex items-center gap-2 mt-4">
          <div className="relative w-full">
            {/* input 왼쪽에 아이콘(absolute) */}
            <label className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer m-0">
              <input
                type="file"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
              <img src="/Clip.png" alt="paperclip" className="w-5" />
            </label>
            <Input
              type="text"
              placeholder="메시지를 입력하세요"
              className="h-12 w-full border border-gray rounded-full pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-purple text-base"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === "Enter") handleSend();
              }}
              ref={inputRef}
            />
          </div>
          <Button
            type="button"
            className="w-12 h-12 rounded-full bg-purple text-white text-base font-semibold flex items-center justify-center
              hover:bg-purple active:bg-purple focus:bg-purple"
            onClick={handleSend}
          >
            <img src="/Send.svg" alt="Send" className="h-6 -rotate-90" />
          </Button>
        </div>
      </div>
      {/* 햄버거 메뉴 사이드 패널 */}
      {/* 항상 렌더링, 상태에 따라 translate-x-full/0 적용 */}
      <>
        {/* 오버레이 */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        {/* 패널 */}
        <div
          className={`fixed top-0 right-0 h-full bg-white z-40 shadow-lg transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ width: '80vw', maxWidth: 400 }}
        >
          {/* 닫기 버튼 */}
          <img
            src="/x.png"
            alt="닫기"
            className="absolute top-4 right-4 w-6 h-6 cursor-pointer mt-6 mr-4"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* 패널 내용 */}
          <div className="p-8">
            <h2 className="text-xl font-bold mb-4">안녕하세요, 송원영님!</h2>
            <ul className="space-y-4">
              <li>개인 정보 수정</li>
              <li>글씨 크기 조정</li>
              <li>읽어주기 모드</li>
            </ul>
          </div>
        </div>
      </>
    </div>
  );
};

export default StartChat;

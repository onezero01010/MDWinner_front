import React, { useState, useRef, useEffect } from 'react';
import '../patient/hideScrollbar.css'; // 스크롤바 숨김용 CSS import (없으면 생성)

type ChatMessage = {
  question: string;
  answer: string;
};

interface StartChatProps {
    externalMessages?: ChatMessage[];
}

const StartChat: React.FC<StartChatProps> = ({externalMessages}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter' && inputValue.trim() !== '') {
  //     // 임시 답변 예시
  //     const answer = '이것은 답변입니다.';
  //     setMessages([...messages, { question: inputValue, answer }]);
  //     setInputValue('');
  //   }
  // };

  // 새 메시지 추가 시 스크롤 하단으로 이동
  useEffect(() => {
    if(externalMessages) {
      setMessages(externalMessages);
    }
}, [externalMessages]);
  
  return (
    <div className="min-h-screen flex flex-col bg-white pt-8 pb-4">
      {/* 중앙 안내/채팅 영역 (스크롤) */}
      <div
        ref={chatRef}
        className="flex-1 min-h-0 flex flex-col items-start justify-start w-full pt-4 overflow-y-auto mb-8"
        style={{ paddingTop: '120px', paddingBottom: messages.length === 0 ? '120px' : '80px' }}
      >
        
          <div className="flex flex-col gap-2 w-full max-w-md px-4">
            {messages.map((msg, idx) => (
              <React.Fragment key={idx}>
                {/* 내 메시지(오른쪽, 흰색) */}
                <div className="flex justify-end">
                  <div className="bg-white text-gray-900 rounded-2xl rounded-tr-md px-4 py-2 shadow border border-gray max-w-[70%]">
                    {msg.question}
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
      </div>
    </div>
  );
};

export default StartChat;

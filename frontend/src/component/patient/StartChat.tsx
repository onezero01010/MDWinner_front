import React from 'react';

const StartChat = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-white pt-8 pb-4">
      {/* 상단 로고 */}
      <div className="w-full flex items-start pl-8">
        <img src="/PurpleLogo.svg" alt="Logo" className="w-16 h-16" />
      </div>
      {/* 중앙 말풍선 */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="bg-white rounded-xl shadow-lg px-6 py-5 max-w-md w-[90%] text-gray-800 text-base font-medium mb-8">
          안녕하세요, 송진영님!<br />
          혹시 문제가 있다면 저에게 말씀해주시면 적절한 대응 방법을 알려드릴 수 있어요!
        </div>
      </div>
      {/* 하단 선택 버튼들 */}
      <div className="w-full max-w-md px-4 flex flex-wrap gap-2 justify-center mb-2">
        <button className="bg-white border border-gray rounded-full px-4 py-2 text-sm shadow-sm">체온 올리는 법, 열도 동반인가요?</button>
        <button className="bg-white border border-gray rounded-full px-4 py-2 text-sm shadow-sm">이런 복약방법은 어떤 것이 있나요?</button>
        <button className="bg-white border border-gray rounded-full px-4 py-2 text-sm shadow-sm">더운 20일<br/>식단과 영양제<br/>양수 축소 치료</button>
        <button className="bg-white border border-gray rounded-full px-4 py-2 text-sm shadow-sm">관련 25일<br/>출혈량<br/>브라운색/분홍색 소량/점막과 섞인</button>
      </div>
      {/* 입력창 자리(디자인용) */}
      <div className="w-full max-w-md px-4">
        <div className="h-8 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
};

export default StartChat;

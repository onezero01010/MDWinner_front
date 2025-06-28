import React from 'react';

const Information = () => {
  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-white pt-24">
      {/* 로고 */}
      <img src="/PurpleLogo.svg" alt="Logo" className="w-24 h-28 mb-10" />
      <form className="w-full max-w-xs flex flex-col gap-6">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-900">아이디</label>
          <input
            id="id"
            type="text"
            className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="아이디를 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-900">비밀번호</label>
          <input
            id="password"
            type="tel"
            className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="비밀번호를 입력하세요"
          />
        </div>
      </form>
    </div>
  );
};

export default Information;

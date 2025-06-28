import React from 'react';
import { useNavigate } from 'react-router-dom';

const Information = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/patient/certification');
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-white pt-24">
      {/* 로고 */}
      <img src="/PurpleLogo.svg" alt="Logo" className="w-24 h-28 mb-10" />
      <form className="w-full max-w-xs flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-900">이름</label>
          <input
            id="name"
            type="text"
            className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="이름을 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-900">전화번호</label>
          <input
            id="phone"
            type="tel"
            className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="전화번호를 입력하세요"
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full py-3 bg-purple text-white rounded-lg font-semibold text-lg hover:bg-purple/90 transition-colors"
        >
          확인
        </button>
      </form>
    </div>
  );
};

export default Information;

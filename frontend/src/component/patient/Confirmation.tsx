import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/patient/start-chat');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-white pt-16 pb-6">
      <div className="w-full flex flex-col items-center">
        {/* 로고 */}
        <img src="/PurpleLogo.svg" alt="Logo" className="w-20 h-24 mb-8" />
        <form className="w-full max-w-xs flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-900">이름</label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
              placeholder="이름을 입력하세요"
            />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label htmlFor="age" className="block mb-2 text-sm font-semibold text-gray-900">나이</label>
              <input
                id="age"
                type="number"
                className="w-full px-4 py-2 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="나이"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="gender" className="block mb-2 text-sm font-semibold text-gray-900">성별</label>
              <input
                id="gender"
                type="text"
                className="w-full px-4 py-2 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="성별"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label htmlFor="height" className="block mb-2 text-sm font-semibold text-gray-900">키</label>
              <input
                id="height"
                type="number"
                className="w-full px-4 py-2 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="키"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="weight" className="block mb-2 text-sm font-semibold text-gray-900">몸무게</label>
              <input
                id="weight"
                type="number"
                className="w-full px-4 py-2 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="몸무게"
              />
            </div>
          </div>
        </form>
      </div>
      <button
        type="button"
        className="w-full max-w-xs py-3 bg-purple text-white rounded-lg font-semibold text-lg hover:bg-purple/90 transition-colors"
        onClick={handleConfirm}
      >
        확정 완료
      </button>
    </div>
  );
};

export default Confirmation;

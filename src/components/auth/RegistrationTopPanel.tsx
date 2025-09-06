import React from 'react';

interface RegistrationTopPanelProps {
  onRegisterClick?: () => void;
}

export const RegistrationTopPanel: React.FC<RegistrationTopPanelProps> = ({ onRegisterClick }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-20 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-md px-6 py-4 border-b border-gray-100">
      {/* Left: Logo and App Name */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Replace with your logo image if available */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {/* Example: First letter of app name */}
          <span>M</span>
        </div>
        <span className="text-xl font-bold text-gray-900 truncate">Math School Portal</span>
      </div>
      {/* Center: App Description */}
      <div className="flex-1 text-center px-4">
        <span className="text-base text-gray-700 font-medium">Empowering learners and educators with digital resources</span>
      </div>
      {/* Right: Register Button */}
      <div>
        <button
          onClick={onRegisterClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );
};

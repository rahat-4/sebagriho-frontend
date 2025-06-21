import React from "react";

const LoadingComponent = ({ name }: { name: string }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <div
            className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-spin mx-auto"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>
        <div className="space-y-2">
          <p className="text-slate-700 font-semibold text-lg">{name}</p>
          <p className="text-slate-500 text-sm">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;

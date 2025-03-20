import React from 'react';

const Loading = (): React.ReactElement => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-indigo-500 animate-spin">
          </div>
        </div>
        <div className="text-lg text-gray-500 animate-pulse">Loading...</div>
      </div>
    </div>
  )
}

export default Loading; 
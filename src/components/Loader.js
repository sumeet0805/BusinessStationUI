import React from "react";

export default function Loader() {
  return (
  <div className="absolute inset-0 bg-black opacity-70 flex items-center justify-center z-10">
    <div className="h-10 w-10 border-4 rounded-full border-t-transparent animate-spin"></div>
  </div>
  );
}

import React from "react";

const Chating = ({
  rightClass,
  leftClass,
  leftTxt,
  rightTxt,
  sender,
  reciever,
  senderTime,
  recieverTime,
}) => {
  return (
    <div className="h-screen border border-[#010b27] w-full overflow-x-auto overflow-y-auto">
      <div className="p-9">
        <div className="mt-1 mb-1 text-justify text-white max-w-[45%] p-4">
          <p className="text-justify text-[12px] text-[#a3020a] shadow p-[1px] bg-[#132435] w-fit p-1 mb-2 rounded-full">
            {sender}
          </p>
          <p className="break-words text-justify text-[12px] bg-[#132435] p-1 w-fit rounded-tr-xl rounded-bl-xl rounded-br rounded-br-lg">
            {leftTxt}
          </p>
          <p className="cursor-not-allowed text-center text-[#a3020a] text-[10px] bg-[#132435] w-fit p-1 mt-2 rounded-full ">
            {senderTime}
          </p>
        </div>
        <div className="mt-1 mb-1 text-black text-justify max-w-[45%] ml-auto">
          <p className="text-justify text-[12px] text-[#a3020a] shadow bg-[#132435] w-fit p-1 mb-2 rounded-full">
            {reciever}
          </p>
          <p className="text-justify text-[12px] bg-[#3194f8] h-auto break-words w-fit p-[4px]  rounded-tl-xl rounded-bl-xl rounded-br rounded-br-xl">
            {rightTxt}
          </p>
          <p className="cursor-not-allowed text-center text-[#a3020a] text-[10px] bg-[#132435] w-fit p-1 mt-2 rounded-full">
            {recieverTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chating;

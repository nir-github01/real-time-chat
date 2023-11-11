import React from "react";

const UsersProfile = ({
  mainClass,
  imgClass,
  pClass,
  spanClass,
  pId,
  c_Id,
  user,
  status,
  age,
  gender,
  Connect,
  width,
  height,
}) => {
  return (
    <>
      <div className={mainClass}>
        <div className={imgClass}>
          <img
            className="cursor-pointer  rounded-full border borde-gray-light "
            width={width}
            height={height}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
            alt=" description"
          ></img>
        </div>
        <div className={pClass} id={pId}>
          <p className="m-0 cursor-pointer text-md">{user}</p>
          <p className="m-0 text-md">{gender}</p>
          <p className="m-0 text-md">{age}</p>
          <p className="m-0 text-md">{status}</p>
        </div>
        <span className={spanClass} id={c_Id}>
          {Connect}
        </span>
      </div>
    </>
  );
};

export default UsersProfile;

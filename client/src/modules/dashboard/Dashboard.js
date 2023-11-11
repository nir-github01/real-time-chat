import React, { useState, useEffect, useRef } from "react";
import ProfileImage from "../../components/ProfileImage";
import UsersProfile from "../../components/UsersProfile";
import {connect, io} from 'socket.io-client';

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:details"))
  );
  const [userConversation, setUserConversation] = useState([]);
  const [messages, setMessages] = useState({});
  const [allUser, setAllUser] = useState([]);
  const [chatMessage, setchatMessage] = useState()
  const [getConversationId, setGetConversationId] = useState();
  const [status, setStatus] = useState([])
  
  const [socket, setSocket] = useState(null);

  const messageRef = useRef(null);
  
  console.log(status)

  useEffect(() => {
    setSocket(io("http://localhost:8080"))
  }, []);

  useEffect(()=> {
      socket?.emit('addUser', user._id);
    socket?.on('getUsers', (users)=>{
         setStatus(users)
      });
    
      socket?.on('getMessages', (data)=>{
           setMessages((prev) => ({
            ...prev,
            messages:[ ...prev.messages, {user:data.user, messages:data.message, createdTime:data.time} ] 
           }))
          
      })
  }, [socket])
  useEffect(() => {
    try {
      let loggedInUser = JSON.parse(localStorage.getItem("user:details"));
      // setUser(loggedInUser);
      let getConversation = async () => {
        let getResponse = await fetch(
          `http://localhost:8000/api/user/usersconversation/${loggedInUser?._id} `,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let Conversation = await getResponse.json();
        setUserConversation(Conversation);

      };
      getConversation();
    } catch (error) {
      console.log(error);
    }
  }, []);

  let fetchMessages = async (conversationId, recieverUser) => {
    setGetConversationId(conversationId);

    let responseMessage = await fetch(
      `http://localhost:8000/api/user/message/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let messagesdata = await responseMessage.json();
    setMessages({messages:messagesdata, recieverUser:recieverUser});

    // console.log(conversationId, recieverUser)

  };
  useEffect(() => {
    let fetchUsers = async () => {
      let response = await fetch(
        "http://localhost:8000/api/user/usersdetails",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let users = await response.json();
      setAllUser(users);
    };

    fetchUsers();
  }, []);
  let handleChatMessages=async(event)=> {
    setchatMessage(event.target.value);
  }

  let sendChatMessages = async(event) => {
    event.preventDefault();
     socket.emit('sendMessages', {
      senderId:user._id,
      conversationId:messages.messages.conversationId,
      message:chatMessage,
      recieverId:messages.recieverUser,
     })
    let sendChat = await fetch("http://localhost:8000/api/user/message", {
      method:'POST',
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        conversationId:getConversationId ? getConversationId : 'new',
        senderId:user._id,
        recieverId:messages.recieverUser,
        message:chatMessage
      })

    })
    let newChat = await sendChat.json();
    setchatMessage('')
  }

  useEffect(()=> {
      messageRef.current?.scrollIntoView({behavior:'smooth'});
  }, [messages?.messages])
  return (
    <div className="w-screen flex">
      <div className="w-[25%]  border border-[#010b27] text-white text-white-500">
        <div className="mb-4">
          <ProfileImage id="text-justify ml-6" userName={user.fullName} />
        </div>
        <hr />
        <div className="h-screen overflow-y-auto">
          <h3 className="text-justify text-xl p-5 mb-5">Message</h3>
          {userConversation  ? (
            userConversation.map((userData, idx) => {
              return (
                <div key={ idx }>
                  <div
                    className="bg-[#172533] text-justify flex items-center p-2"
                    onClick={() => fetchMessages(userData.conversationId, userData.user.userId)}
                  >
                    <div>
                      <img
                        className="cursor-pointer ml-2 rounded-full border borde-gray-light w-[30%]"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
                        alt=" description"
                      />
                    </div>
                    <div className="relative right-[40%] ">
                      <span className=" cursor-pointer">
                      {userData.user.fullName}
                      </span>
                      <br />
                      <span className=" "></span>
                      <br />
                      <span className=" ">{userData.user.age} </span>
                      <br />
                      <span className=" "> online </span>
                    </div>
                    <div>
                      <span className=" mr-8 cursor-pointer" id="">
                        <svg
                          className="w-8 h-8 bg-[#030120] p-1 text-white-800 shadow rounded-full  dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 18"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m16.344 12.168-1.4-1.4a1.98 1.98 0 0 0-2.8 0l-.7.7a1.98 1.98 0 0 1-2.8 0l-2.1-2.1a1.98 1.98 0 0 1 0-2.8l.7-.7a1.981 1.981 0 0 0 0-2.8l-1.4-1.4a1.828 1.828 0 0 0-2.8 0C-.638 5.323 1.1 9.542 4.78 13.22c3.68 3.678 7.9 5.418 11.564 1.752a1.828 1.828 0 0 0 0-2.804Z"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })
          ) : (
            <div> No Conversations </div>
          )}
        </div>
      </div>
      <div className="w-[50%] border-[#010b27] text-white text-white-500">
        <div>
          <div className="bg-[#01162b] rounded-full m-5 p-2 mb-5">
            <UsersProfile
              mainClass={"ml-6 flex"}
              user={allUser ? allUser.map((reciever, idx) =>{

                    if(reciever._id === messages.recieverUser){
                      return(reciever.fullName)
                    }
              }):''}
              pClass={"text-justify ml-5"}
              status={"online"}
              spanClass={" p-1  ml-auto mr-6 "}
              Connect={
                <svg
                  className="w-8 h-8 bg-[#030120] rounded-full shadow p-1 text-white-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m16.344 12.168-1.4-1.4a1.98 1.98 0 0 0-2.8 0l-.7.7a1.98 1.98 0 0 1-2.8 0l-2.1-2.1a1.98 1.98 0 0 1 0-2.8l.7-.7a1.981 1.981 0 0 0 0-2.8l-1.4-1.4a1.828 1.828 0 0 0-2.8 0C-.638 5.323 1.1 9.542 4.78 13.22c3.68 3.678 7.9 5.418 11.564 1.752a1.828 1.828 0 0 0 0-2.804Z"
                  />
                </svg>
              }
              width={45}
            />
          </div>
        </div>
        <div>
          <div className="h-screen border border-[#010b27] w-full overflow-x-auto overflow-y-auto">
            {messages.messages ? 
            messages.messages.map((msg, index) => {
                if(msg.user.userId  === user._id ){
                  return (
                  
                      <div className="mt-1 mb-1 text-justify text-white max-w-[45%] p-4" key={[index]}>
                        {/* <p className="text-justify text-[12px] text-[#a3020a] shadow p-[1px] bg-[#132435] w-fit p-1 mb-2 rounded-full">
                          {msg.user.fullName}
                        </p> */}
                        <p className="break-words text-justify text-[12px] bg-[#132435] p-1 w-fit rounded-tr-xl rounded-bl-xl rounded-br rounded-br-lg">
                          { msg.messages}  
                        </p>
                        <p className="cursor-not-allowed text-center text-[#a3020a] text-[10px] bg-[#132435] w-fit p-1 mt-2 rounded-full ">
                         {msg.createdTime}
                        </p>
                        <div ref={messageRef} />
                      </div>
                      
                   
                  )
                }
                else{
                  return(
                    <div className="mt-1 mb-1 text-black text-justify max-w-[45%] ml-auto" key={[index]}>
                      {/* <p className="text-justify text-[12px] text-[#a3020a] shadow bg-[#132435] w-fit p-1 mb-2 rounded-full">
                        {msg.user.fullName}
                      </p> */}
                      <p className="text-justify text-[12px] bg-[#3194f8] h-auto break-words w-fit p-[4px]  rounded-tl-xl rounded-bl-xl rounded-br rounded-br-xl">
                        {msg.messages}
                      </p>
                      <p className="cursor-not-allowed text-center text-[#a3020a] text-[10px] bg-[#132435] w-fit p-1 mt-2 rounded-full">
                        {msg.createdTime}
                      </p>
                      <div ref={messageRef} />
                    </div>
              

                )}
            }): <div className="text-white-500">No Conversation </div> }  
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
        
          <input
            type="text"
            id="search"
            className="static block m-auto w-[70%] p-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[45px]"
            placeholder="Type message........"
            onChange={handleChatMessages}
          />
          <button
            type="submit"
            className="static text-white absolute right-20 bottom-1  hover:bg-[#01162b]-800 focus:ring-4 focus:outline-none focus:ring-[#01162b]-300 font-lg rounded-lg text-sm px-4 py-2 dark:bg-[#01162b]-600 dark:hover:bg-[#01162b]-700 dark:focus:ring-[#01162b]-800 h-auto"
            onClick={sendChatMessages}
          >
            <svg
              className="rotate-90 w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="w-[25%] h-screen border border-[#010b27] text-white text-white-500">
        <div className="m-4 text-justify flex justify-center">
          <UsersProfile
            mainClass={"flex items-center text-sm m-2"}
            pClass={"ml-2"}
            user="Admin"
            status="online"
            width={45}
            height={45}
          />
        </div>
        <hr />
        <div className="h-screen mr-3 overflow-y-auto">
          {allUser ? (
            allUser.map((userlist, idx) => {
              if(userlist._id !== user._id)
              return (
                <div key={idx}>
                
                  <div
                    className="flex items-center bg-[#070522] text-justify m-5 p-1"
                     onClick={()=>fetchMessages()}
                     >
                    <div>
                      <img
                        className="cursor-pointer rounded-full border borde-gray-light "
                        width={"55"}
                        height={"55"}
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
                        alt=" description"
                      />
                    </div>
                    <div className="">
                      <p className="ml-[6px] cursor-pointer text-[12px]">
                        {userlist.fullName}
                      </p>
                      <p className="ml-[6px] text-[12px]">online</p>
                    </div>
                    <span className="ml-6">
                      <svg
                        className="w-8 h-8 bg-[#030120] p-1 text-white-800 shadow rounded-full  dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m16.344 12.168-1.4-1.4a1.98 1.98 0 0 0-2.8 0l-.7.7a1.98 1.98 0 0 1-2.8 0l-2.1-2.1a1.98 1.98 0 0 1 0-2.8l.7-.7a1.981 1.981 0 0 0 0-2.8l-1.4-1.4a1.828 1.828 0 0 0-2.8 0C-.638 5.323 1.1 9.542 4.78 13.22c3.68 3.678 7.9 5.418 11.564 1.752a1.828 1.828 0 0 0 0-2.804Z"
                        />
                      </svg>
                    </span>
                  </div>
                  <hr />
                </div>
              );
            })
          ) : (
            <div className="text-white-600"> No Users</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

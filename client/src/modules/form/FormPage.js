import React, { useState } from 'react'
import Input from '../../components/InputPage.js'
import Button from '../../components/Button.js'
import Checkbox from "../../components/Checkbox.js";
import { useNavigate } from "react-router-dom";
import RadioIpt from "../../components/RadioIpt.js";

const FormPage = ({ isSignIn = false }) => {
  //Form Data submission
  const [form, setForm] = useState("");
  const [tc, setTC] = useState();
  const [mergeform, setMergeForm] = useState({});
  const [error, setError] = useState();

  //Navigation
  const navigate = useNavigate();

  let handleIpt = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };
  let handleCheckBox = (event) => {
    setTC(event.target.checked);
  };

  let submitForm = async (event) => {
    event.preventDefault();
    setMergeForm({ ...form, tc });

    if (mergeform !== undefined && mergeform !==null) {
      let response = await fetch(
        `http://localhost:8000/api/user/${isSignIn ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mergeform),
        }
      );
      let data = await response.json();
      setError(data.message);
      if (data.token) {
        localStorage.setItem("user:token", data.token);
        localStorage.setItem(
          "user:details",
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };
  return (
    <div>
      <div className="container h-screen bg-white rounded-md shadow-md p-10 ">
        <div className="text-2xl text-blue-700">
          Welcome {isSignIn && "Back"}
        </div>
        <div className="text-xl text-blue-400 mb-5">
          {isSignIn
            ? "SignIn now to explore more"
            : "SignUp now to get started"}
        </div>
        <div className='m-2'>
          <ul>
             <li> {error ? error.message : ""}</li>
          </ul>
        </div>
        <form onSubmit={submitForm}>
          {!isSignIn && (
            <Input
              type="text"
              name="fullName"
              placeholder="enter name "
              label="Full Name"
              onChange={handleIpt}
            />
          )}
          {!isSignIn && (
            <Input
              type="number"
              name="phone"
              placeholder="enter phone "
              label="Phone"
              onChange={handleIpt}
            />
          )}
          {!isSignIn && (
            <div>
              <div className="text-sm font-medium text-blue-900 dark:text-blue mt-2 mb-2">
                Gender
              </div>
              <RadioIpt
                type={"radio"}
                id={"male"}
                value={"male"}
                name="gender"
                label={"Male"}
                onChange={handleIpt}
              />
              <RadioIpt
                type={"radio"}
                id={"Female"}
                value={"female"}
                name={"gender"}
                label={"Female"}
                onChange={handleIpt}
              />
              <RadioIpt
                type={"radio"}
                id={"Other"}
                value={"other"}
                name={"gender"}
                label={"Other"}
                onChange={handleIpt}
              />
            </div>
          )}
          {!isSignIn && (
            <Input
              type={"text"}
              name={"age"}
              placeholder={"enter age"}
              label={"Age"}
              onChange={handleIpt}
              autoComplete="userage"
              isRequired="required"
            />
          )}
          <Input
            type="email"
            name="email"
            placeholder="enter email "
            label="Email"
            onChange={handleIpt}
            autoComplete="username"
            isRequired="required"
          />
          <Input
            type="password"
            name={isSignIn ? "currentPassword" : "password"}
            placeholder="enter password "
            label="New-password"
            onChange={handleIpt}
            autoComplete={isSignIn ? "currentPassword" : "newPassword"}
          />
          {!isSignIn && (
            <Input
              type="password"
              name="password_confirmation"
              label="Confirm newPassword"
              placeholder="enter confirm password "
              onChange={handleIpt}
              autoComplete="currentPassword"
            />
          )}
          <Checkbox
            name="tc"
            value={tc}
            checked={tc === true}
            label={isSignIn ? "Remember me " : "I agree with the "}
            sublabel={!isSignIn && " terms and conditions"}
            onChange={handleCheckBox}
          />
          <Button
            type="submit"
            className="btn btn-blue"
            label={isSignIn ? "SIGNIN" : "SIGNUP"}
          />
        </form>
        <div className="text-black ">
          {isSignIn ? "User didn't register  " : "Already have an account ?  "}
          <span
            className="text-blue-400 underline cursor-pointer"
            onClick={() => navigate(`/user/${isSignIn ? "signup" : "login"}`)}
          >
            {isSignIn ? "SignUp" : "SignIn"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormPage;

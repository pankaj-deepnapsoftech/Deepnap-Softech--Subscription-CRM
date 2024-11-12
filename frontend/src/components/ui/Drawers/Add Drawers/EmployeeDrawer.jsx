import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiX } from "react-icons/bi";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import {toast} from 'react-toastify';

const EmployeeDrawer = ({ fetchAllEmployees, closeDrawerHandler }) => {
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [designation, setDesignation] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [registering, setRegistering] = useState(false);

  const auth = useSelector(state => state.auth);

  const registerHandler = async (e) => {
    e.preventDefault();

    if (name.length > 50) {
      toast.error("Name field must be less than 50 characters");
      return;
    }
    if (phone.length > 10) {
      toast.error("Phone no. field must be 10 digits long");
      return;
    }

    setRegistering(true);
    try {
      if (email.length === 0 || password.length === 0 || name.length === 0) {
        throw new Error("Please fill all the details!");
      }

      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          designation,
          organizationEmail: auth.email,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success('Employee registration successful. OTP has been sent to the email id.');
      fetchAllEmployees();
      closeDrawerHandler();
    } catch (err) {
      toast.error(err.message);
    }
    finally{
        setRegistering(false);
    }
  };

  return (
    <div
      className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Employee
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Add New Employee
        </h2>

        <form onSubmit={registerHandler}>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
            />
          </FormControl>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
          </FormControl>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Phone</FormLabel>
            <Input
              className="no-scrollbar"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              placeholder="Phone"
            />
          </FormControl>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Designation</FormLabel>
            <Input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              type="text"
              placeholder="Designation"
            />
          </FormControl>
          <FormControl className="mt-3 mb-5 relative" isRequired>
            <FormLabel fontWeight="bold">Password</FormLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            {!showPassword ? (
              <IoEyeOffOutline
                onClick={() => setShowPassword(true)}
                size={20}
                className="absolute top-[42px] right-3 cursor-pointer"
              />
            ) : (
              <IoEyeOutline
                onClick={() => setShowPassword(false)}
                size={20}
                className="absolute top-[42px] right-3 cursor-pointer"
              />
            )}
          </FormControl>

          <Button
            type="submit"
            className="mt-1"
            color="white"
            backgroundColor="#1640d6"
            isLoading={registering}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeDrawer;

import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowpassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [userData, setUserData] = React.useState({
    username: "",
    password: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (userData.username.length < 3) {
      setLoading(false);
      return toast.error("Email is invalid");
    }

    if (userData.password === "") {
      setLoading(false);
      return toast.error("Password is required");
    }

    try {
      const res = await axios.post(`${backendUrl}/api/v1/signin`, userData);

      if (res.status === 200) {
        setLoading(false);
        toast.success("Login successful");
        setUserData({ username: "", password: "" });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const handleDowm = (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleDowm);
    return () => {
      window.removeEventListener("keydown", handleDowm);
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-[90%] h-[90%] bg-[#131313] rounded-2xl p-10 flex md:flex-row flex-col-reverse gap-10 md:my-0 my-10 ">
        <div className="flex-col md:w-1/2 w-full">
          <p className="text-white text-5xl my-4">Login to your account</p>
          <p className="text-gray-500 mt-2 font-bold">
            {" "}
            Don't have an account?
            <a href="/auth/register" className="text-orange-500 pl-3">
              Sign up
            </a>
          </p>
          <div className="flex flex-col">
            <TextField
              id="outlined-basic"
              label="Username"
              variant="filled"
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
              sx={{
                marginTop: "1rem",
                "& .MuiInputBase-root": {
                  backgroundColor: "#333",
                  color: "white",
                  borderRadius: "20px",
                  border: "none",
                },
                "& .MuiFormLabel-root": {
                  color: "gray !important",
                  fontSize: "14px",
                  fontWeight: "bold",
                },
                "& .Mui-focused .Mui-hovered .MuiFormLabel-root": {
                  border: "none",
                  backgroundColor: "#333 !important",
                  color: "white",
                },
                "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                  {
                    display: "none",
                  },
              }}
            />

            <TextField
              id="outlined-basic"
              label="Password"
              variant="filled"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              sx={{
                marginTop: "1rem",
                "& .MuiInputBase-root": {
                  backgroundColor: "#333 !important",
                  color: "white !important",
                  borderRadius: "20px",
                  border: "none",
                },
                "& .MuiFormLabel-root": {
                  color: "gray !important",
                  fontSize: "14px",
                  fontWeight: "bold",
                },
                "& .Mui-focused .Mui-hovered .MuiFormLabel-root": {
                  border: "none",
                  backgroundColor: "#333 !important",
                  color: "white",
                },
                "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                  {
                    display: "none",
                  },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={() => {
                      setShowpassword(!showPassword);
                    }}
                  >
                    <Visibility sx={{ color: "white", cursor: "pointer" }} />
                  </InputAdornment>
                ),
              }}
            />

            <button
              className="bg-[#FE5B31] text-white rounded-2xl py-2 mt-4 w-64"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "logging..." : "Login"}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center md:block hidden">
          <img
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2RxaTBuNmRqNHN6Zm9jcXNqMjlmczZkZGJ0YXM3cWVkMDNzOHRlbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/r8b5bRsznrT6naOLq9/giphy.webp"
            alt="register"
            className="h-[80%] object-cover mx-auto align-middle"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;

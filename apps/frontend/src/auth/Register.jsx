import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  document.title = "Register";
  const [showPassword, setShowpassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [userData, setUserData] = React.useState({
    username: "",
    password: "",
    type: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (userData.username.length < 3) {
      setLoading(false);
      return toast.error("Username must be at least 3 characters");
    }

    if (userData.password === "") {
      setLoading(false);
      return toast.error("Password is required");
    }

    if (userData.password.length < 8) {
      setLoading(false);
      return toast.error("Password must be at least 8 characters");
    }

    if (userData.type === "") {
      setLoading(false);
      return toast.error("Role is required");
    }

    try {
      const res = await axios.post(`${backendUrl}/api/v1/signup`, userData);
      if (res.status === 200) {
        setLoading(false);
        toast.success("Account created successfully");
        setUserData({ username: "", password: "", type: "" });
        navigate("/auth/login");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
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
          <p className="uppercase text-sm font-bold text-gray-500 mt-4">
            start for free
          </p>
          <p className="text-white text-5xl my-4">Create an account</p>
          <p className="text-gray-500 mt-2 font-bold">
            {" "}
            Already a member?
            <a href="/auth/login" className="text-orange-500 pl-3">
              Log in
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
                  backgroundColor: "#333 !important",
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
                    {
                      showPassword ? (
                        <Visibility sx={{ color: "white" }} />
                      ) : (
                        <VisibilityOff sx={{ color: "white" }} />
                      ) // show password icon
                    }
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={userData.type}
                label="Role"
                sx={{
                  backgroundColor: "#333 !important",
                  color: "white !important",
                  border: "none",
                  borderRadius: "20px",
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: "#333 !important",
                    color: "white !important",
                    border: "none",
                  },
                }}
                onChange={(e) =>
                  setUserData({ ...userData, type: e.target.value })
                }
              >
                <MenuItem value={"user"}>User</MenuItem>
                <MenuItem value={"admin"}>Admin</MenuItem>
              </Select>
            </FormControl>

            <button
              className="bg-[#FE5B31] text-white rounded-2xl py-2 mt-4 w-64"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "creating account..." : "Create Account"}
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

export default Register;

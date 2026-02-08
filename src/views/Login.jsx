import { useState } from "react";
import axios from "axios";
import { toastError, toastSuccess } from "../utils/toast";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { emailValidation, passwordValidation } from "../utils/vaildation";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ setIsAuth, getProducts }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/products";

  // const handleLogin = () => {
  //   const token = "取得的token";
  //   localStorage.setItem("token", token);

  //   // 登入成功後回到原本頁面
  //   navigate(from, { replace: true });
  // };
  // 表單資料狀態(儲存登入表單輸入)
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange", defaultValues: { username: "", password: "" } });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((preData) => ({ ...preData, [name]: value }));
  // };

  const onSubmit = async (formData) => {
    try {
      // e.preventDefault();
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)}`;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = token;
      toastSuccess("登入成功");
      navigate(from, { replace: true });
      // setIsAuth(true);
      // getProducts();
    } catch (error) {
      // setIsAuth(false);
      toastError(`登入失敗`);
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="container login">
      <h1>登入</h1>
      <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="username"
            name="username"
            placeholder="name@example.com"
            {...register("username", emailValidation)}
            // value={formData.username}
            // onChange={(e) => handleInputChange(e)}
          />
          {errors.username && <p className="text-danger">{errors.username.message}</p>}
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            {...register("password", passwordValidation)}
            // value={formData.password}
            // onChange={(e) => handleInputChange(e)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="position-absolute end-0 top-50 translate-middle-y btn btn-sm"
            style={{ background: "transparent", border: "none" }}
          >
            <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
          </button>
          {errors.password && <p className="text-danger">{errors.password.message}</p>}
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-2" disabled={!isValid}>
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;

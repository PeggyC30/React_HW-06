import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // 未登入 → 導向 login，並記錄原本想去的頁面
    return <Navigate to="/#/admin/login" replace state={{ from: location }} />;
  }

  return children; // 已登入 → 放行
};

export default ProtectedRoute;

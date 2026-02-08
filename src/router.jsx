import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout";
import Products from "./views/front/Products";
import SingleProduct from "./views/front/SingleProduct";
import Cart from "./views/front/Cart";
import NOtFound from "./views/front/NotFound";
import Home from "./views/front/Home";
import App from "./App";
import Login from "./views/Login";
import AdminProducts from "./views/admin/adminProducts";
import ProtectedRoute from "./views/admin/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <FrontendLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "product", element: <Products /> },
          { path: "product/:id", element: <SingleProduct /> },
          { path: "cart", element: <Cart /> },

          // { path: "admin", element: <AdminProducts /> },
        ],
      },
      { path: "/admin/login", element: <Login /> },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "products",
            element: <AdminProducts />,
          },
        ],
      },

      { path: "*", element: <NOtFound /> },
    ],
  },
]);

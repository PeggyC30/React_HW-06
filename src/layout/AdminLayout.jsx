import { Link, NavLink, Outlet } from "react-router";

function AdminLayout() {
  return (
    <>
      <header>
        <ul className="nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              首頁
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/product">
              產品列表
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/cart">
              購物車
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/products">
              管理者
            </NavLink>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}

export default AdminLayout;

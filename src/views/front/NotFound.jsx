import { Link, useNavigate } from "react-router";

function NOtFound() {
  const navigate = useNavigate();
  return (
    <>
      <h2>404</h2>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        回到上一頁
      </button>
    </>
  );
}

export default NOtFound;

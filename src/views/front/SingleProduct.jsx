import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { toastError, toastSuccess } from "../../utils/toast";
import { RotatingLines } from "react-loader-spinner";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [cartQty, setCartQty] = useState(1);

  const handleAddCart = () => {
    addCart(id, cartQty);
  };

  useEffect(() => {
    const handleProductDetail = async (id) => {
      try {
        const res = await axios.get(` ${API_BASE}/api/${API_PATH}/product/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };
    handleProductDetail(id);
  }, [id]);

  const addCart = async (id, num = 1) => {
    setLoadingCartId(id);

    try {
      const data = { product_id: id, qty: num };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
      toastSuccess("已加入購物車");
    } catch (error) {
      console.log(error.response);
      toastError(`加入購物車失敗,${error.response.data.message}`);
    } finally {
      setLoadingCartId(null);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="card ">
          <img
            src={product.imageUrl}
            className="card-img-top "
            alt={product.title}
            style={{ height: "400px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">{product.title}</h5>
            <p className="card-text">{product.desciption}</p>
            <p className="card-text">價格：{product.price}</p>

            <p className="card-text">
              <small className="text-body-secondary">{product.unit}</small>
            </p>
            <div className="d-flex justify-content-center mb-3">
              <div className="input-group input-group-sm mb-3 w-auto mx-auto">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setCartQty((pre) => (pre > 1 ? pre - 1 : 1));
                  }}
                  disabled={cartQty === 1}
                >
                  -
                </button>
                <input
                  style={{ maxWidth: "60px" }}
                  type="text"
                  className="form-control text-center border-secondary "
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  value={cartQty}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setCartQty((pre) => pre + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                handleAddCart();
              }}
              disabled={loadingCartId === product.id}
            >
              {loadingCartId === product.id ? <RotatingLines color="white" width={80} height={16} /> : "加入購物車"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;

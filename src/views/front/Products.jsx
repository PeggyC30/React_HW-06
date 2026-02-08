import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toastError, toastSuccess } from "../../utils/toast";
import { RotatingLines } from "react-loader-spinner";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
  }, []);

  const handleProductDetail = async (id) => {
    navigate(`/product/${id}`);
    // try {
    //   const res = await axios.get(` ${API_BASE}/api/${API_PATH}/product/${id}`);
    //   navigate(`/prducts/${id}`, { state: { productDetail: res.data.product } });
    // } catch (error) {
    //   console.log(error.response);
    // }
  };
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
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product.id}>
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleProductDetail(product.id);
                  }}
                >
                  查看更多
                </button>
                <button
                  type="button"
                  className="btn btn-primary ms-2"
                  onClick={() => {
                    addCart(product.id);
                  }}
                  disabled={loadingCartId === product.id}
                >
                  {loadingCartId === product.id ? <RotatingLines color="white" width={80} height={16} /> : "加入購物車"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";
import { confirmAlert, toastError, toastSuccess } from "../../utils/toast";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { emailValidation, nameValidation, telValidation } from "../../utils/vaildation";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    const getCart = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        setCart(res.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getCart();
  }, []);

  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = { product_id: productId, qty };
      const res = await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, { data });
      const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res2.data.data);
      toastSuccess("已更新購物車");
    } catch (error) {
      console.log(error.response);
      toastError(`購物車更新失敗,${error.response.data.message}`);
    }
  };
  const delCart = async (cartId, cartProductTitle) => {
    const result = await confirmAlert(`確定清除「${cartProductTitle}」？`, `「${cartProductTitle}」將被移除`);

    if (!result.isConfirmed) return;
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
      const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res2.data.data);
      toastSuccess(`已刪除「${cartProductTitle}」`);
    } catch (error) {
      console.log(error.response);
      toastError(`刪除${cartProductTitle}失敗,${error.response.data.message}`);
    }
  };

  const delAllCart = async () => {
    const result = await confirmAlert("確定清空購物車？", "所有商品將被移除，無法復原");

    if (!result.isConfirmed) return;
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res2.data.data);
      toastSuccess("購物車已清空");
    } catch (error) {
      console.log(error.response);
      toastError(`刪除購物車失敗,${error.response.data.message}`);
    }
  };
  const onSubmit = async (formData) => {
    // console.log("表單資料:", formData);
    try {
      const data = { user: formData, message: formData.message };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, { data });
      const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res2.data.data);
      toastSuccess("訂單建立成功");
    } catch (error) {
      toastError(`訂單建立失敗,${error.response.data.message}`);
    }
    // 處理表單提交
    reset(); // 重置表單
  };

  if (!cart?.carts || cart.carts.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h3>購物車是空的</h3>
        <p>去選購喜歡的商品吧！</p>
        <Link className="btn btn-primary border" to="/product">
          去逛逛
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart">
        <h2>購物車列表</h2>
        <div className="text-end mt-4">
          <button type="button" className="btn btn-outline-danger" onClick={() => delAllCart()}>
            清空購物車
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">數量/單位</th>
              <th scope="col">小計</th>
            </tr>
          </thead>
          <tbody>
            {cart?.carts?.map((cartItem) => (
              <tr key={cartItem.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => delCart(cartItem.id, cartItem.product.title)}
                  >
                    刪除
                  </button>
                </td>
                <td scope="row">{cartItem.product.title}</td>

                <td>
                  <div className="d-flex justify-content-center mb-3">
                    <div className="input-group input-group-sm mb-3 w-auto mx-auto">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          if (cartItem.qty <= 1) return;
                          updateCart(cartItem.id, cartItem.product_id, cartItem.qty - 1);
                          // setCartQty((pre) => (pre > 1 ? pre - 1 : 1));
                        }}
                        disabled={cartItem.qty === 1}
                      >
                        -
                      </button>
                      <input
                        style={{ maxWidth: "60px" }}
                        type="text"
                        className="form-control text-center"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        value={cartItem.qty}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          updateCart(cartItem.id, cartItem.product_id, cartItem.qty + 1);
                          // setCartQty((pre) => (pre > 1 ? pre - 1 : 1));
                        }}
                      >
                        +
                      </button>
                      {/* <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                  </span> */}
                    </div>{" "}
                  </div>
                </td>
                <td>{currency(cartItem.final_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">
                總計
              </td>
              <td className="text-end">{currency(cart.final_total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="form mt-5">
        <h2>收件者資訊</h2>
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="請輸入 Email"
                // defaultValue="test@gamil.com"
                {...register("email", emailValidation)}
              />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                placeholder="請輸入姓名"
                // defaultValue="小明"
                {...register("name", nameValidation)}
              />{" "}
              {errors.name && <p className="text-danger">{errors.name.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人手機號碼
              </label>
              <input
                id="tel"
                name="tel"
                type="tel"
                className="form-control"
                placeholder="請輸入手機號碼"
                // defaultValue="0912345678"
                {...register("tel", telValidation)}
              />{" "}
              {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="form-control"
                placeholder="請輸入地址"
                // defaultValue="臺北市信義區信義路5段7號"
                {...register("address")}
              />
              {errors.address && <p className="text-danger">{errors.address.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea id="message" className="form-control" cols="30" rows="10" {...register("message")}></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger" disabled={!isValid}>
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cart;

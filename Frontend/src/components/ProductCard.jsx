import { addToCart } from "../services/cartApi";

export default function ProductCard({ product, userId }) {
  const handleAdd = async () => {
    try {
      const res = await addToCart(product, userId);
      alert(res.message);
    } catch (error) {
      alert("Lỗi khi thêm vào giỏ hàng");
      console.error(error);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">{product.price.toLocaleString()}₫</p>
      <button onClick={handleAdd} className="btn-add-cart">
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}

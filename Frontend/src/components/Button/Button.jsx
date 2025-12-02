import { ShoppingCart } from "lucide-react";

const Button = () => {

  return (
    <div className="mx-auto mt-2 flex flex-col items-center">
      <button
        className="flex items-center gap-x-2 bg-amber-600 text-white py-2 px-4 rounded-full hover:cursor-pointer hover:opacity-90 transition-opacity"
      >
        <ShoppingCart />
        <div className="shrink text-sm">Thêm vào giỏ hàng</div>
      </button>
    </div>
  );
};

export default Button;

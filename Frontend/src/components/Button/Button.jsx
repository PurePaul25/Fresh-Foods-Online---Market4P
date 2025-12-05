"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "../../context/CartContext"

const Button = ({ product }) => {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setIsAdded(true)
    // Reset sau 1.5 giây
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <div className="mx-auto mt-2 flex flex-col items-center">
      <button
        onClick={handleAddToCart}
        disabled={isAdded}
        className={`flex items-center gap-x-2 text-white py-2 px-4 rounded-full transition-all duration-300 transform
          ${isAdded ? "bg-green-500 scale-95" : "bg-amber-600 hover:scale-105 hover:cursor-pointer hover:opacity-90"}`}
      >
        {isAdded ? <Check className="animate-bounce" /> : <ShoppingCart />}
        <div className="shrink text-sm">{isAdded ? "Đã thêm!" : "Thêm vào giỏ hàng"}</div>
      </button>
    </div>
  )
}

export default Button

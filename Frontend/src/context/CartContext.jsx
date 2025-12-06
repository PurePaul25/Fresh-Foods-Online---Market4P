"use client"
import { createContext, useContext, useState } from "react"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Sử dụng _id hoặc id để tìm sản phẩm, đảm bảo mỗi sản phẩm có id duy nhất
            const productId = product._id || product.id
            if (!productId) {
                // Nếu không có id, tạo một id tạm thời dựa trên timestamp
                const tempId = `temp_${Date.now()}_${Math.random()}`
                return [
                    ...prevItems,
                    {
                        ...product,
                        id: tempId,
                        _id: tempId,
                        quantity: 1,
                    },
                ]
            }
            
            const existingItem = prevItems.find((item) => {
                const itemId = item._id || item.id
                return itemId === productId
            })
            
            if (existingItem) {
                // Nếu sản phẩm đã có trong giỏ, tăng số lượng
                return prevItems.map((item) => {
                    const itemId = item._id || item.id
                    return itemId === productId 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                })
            }
            
            // Thêm sản phẩm mới vào giỏ
            return [
                ...prevItems,
                {
                    ...product,
                    id: productId,
                    _id: productId,
                    quantity: 1,
                    // Giữ nguyên price gốc và discount từ shop, KHÔNG tính trước
                },
            ]
        })
    }

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => 
            prevItems.filter((item) => {
                const itemId = item._id || item.id
                return itemId !== productId
            })
        )
    }

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
            return
        }
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                const itemId = item._id || item.id
                return itemId === productId ? { ...item, quantity: newQuantity } : item
            }),
        )
    }

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0)
    }

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
            return total + discountedPrice * item.quantity
        }, 0)
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}

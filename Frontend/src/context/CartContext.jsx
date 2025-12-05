"use client"
import { createContext, useContext, useState } from "react"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id)
            if (existingItem) {
                return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
            }
            return [
                ...prevItems,
                {
                    ...product,
                    quantity: 1,
                    // Giữ nguyên price gốc và discount từ shop, KHÔNG tính trước
                },
            ]
        })
    }

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
    }

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
            return
        }
        setCartItems((prevItems) =>
            prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)),
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

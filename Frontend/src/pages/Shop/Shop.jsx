"use client"

import { useEffect, useRef, useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Button from "../../components/Button/Button"
import Cate_Fruits from "../../assets/images/cate_fruits.avif"
import Cate_Eggs from "../../assets/images/cate_eggs.avif"
import Cate_Veget from "../../assets/images/cate_veget.avif"
import Cate_Meat from "../../assets/images/cate_meat.avif"
import Cate_Bread from "../../assets/images/cate_bread.avif"
import strawberry from "../../assets/images/strawberry.jpg"

function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
      // Trigger immediately if already in viewport
      const rect = currentRef.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true)
      }
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  return [ref, isVisible]
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

function Shop() {
  const [heroRef, heroVisible] = useScrollAnimation()
  const [categoryRef, categoryVisible] = useScrollAnimation()
  const [saleRef, saleVisible] = useScrollAnimation()
  const [bestSellingRef, bestSellingVisible] = useScrollAnimation()
  const [newArrivalsRef, newArrivalsVisible] = useScrollAnimation()

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCategoryProducts, setShowCategoryProducts] = useState(false)

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/products`)

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        const productsArray = Array.isArray(data) ? data : data.products || data.data || []
        console.log("[v0] Fetched products:", productsArray)
        setProducts(productsArray)
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = [
    { id: "fruits", name: "Trái cây", image: Cate_Fruits },
    { id: "eggs", name: "Trứng", image: Cate_Eggs },
    { id: "meat", name: "Thịt", image: Cate_Meat },
    { id: "vegetables", name: "Rau xanh", image: Cate_Veget },
    { id: "bread", name: "Bánh mì", image: Cate_Bread },
  ]

  const getProductImage = (product) => {
    if (product.image) return product.image
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0]
      if (typeof firstImage === "string") return firstImage
      if (firstImage?.url) return firstImage.url
      if (firstImage?.image) return firstImage.image
    }
    return "/placeholder.svg"
  }

  const getCategoryName = (product) => {
    if (typeof product.category === "string") return product.category
    if (product.category_id?.name) return product.category_id.name
    if (product.category?.name) return product.category.name
    return ""
  }

  const categoryProducts = {
    fruits: products.filter((p) => {
      const catName = getCategoryName(p).toLowerCase()
      return (
        catName.includes("trái cây") || catName.includes("fruit") || catName.includes("táo") || catName.includes("cam")
      )
    }),
    eggs: products.filter((p) => {
      const catName = getCategoryName(p).toLowerCase()
      return catName.includes("trứng") || catName.includes("egg")
    }),
    meat: products.filter((p) => {
      const catName = getCategoryName(p).toLowerCase()
      return catName.includes("thịt") || catName.includes("meat")
    }),
    vegetables: products.filter((p) => {
      const catName = getCategoryName(p).toLowerCase()
      return catName.includes("rau") || catName.includes("vegetable")
    }),
    bread: products.filter((p) => {
      const catName = getCategoryName(p).toLowerCase()
      return catName.includes("bánh") || catName.includes("bread")
    }),
  }

  const saleProducts = products.filter((p) => p.discount && p.discount > 0)
  const bestSelling = products.filter((p) => p.isBestSelling || p.rating_average >= 4 || true).slice(0, 10)
  const newArrivals = products
    .filter((p) => {
      if (p.isNew) return true
      if (p.createdAt) {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return new Date(p.createdAt) > thirtyDaysAgo
      }
      return true
    })
    .slice(0, 5)

  // Debug logs
  console.log("Total products:", products.length)
  console.log("Sale products:", saleProducts.length)
  console.log("Best selling:", bestSelling.length)
  console.log("New arrivals:", newArrivals.length)

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId)
    setShowCategoryProducts(true)
  }

  const closeCategoryModal = () => {
    setShowCategoryProducts(false)
    setSelectedCategory(null)
  }

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory)

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header>
          <Navbar />
        </header>
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header>
          <Navbar />
        </header>
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800">Không thể tải sản phẩm</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-15">
        {/* Hero Section - FIXED: bg-linear-to-r instead of bg-linear-to-r */}
        <section
          ref={heroRef}
          className="relative px-6 md:px-16 lg:px-32 py-16 bg-linear-to-r from-amber-500 via-amber-400 to-orange-400 overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative max-w-4xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              Ưu đãi đặc biệt hôm nay
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Thực phẩm tươi sạch
              <br />
              <span className="text-amber-900">Giao tận nhà</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl">
              Chọn ngay những sản phẩm tươi ngon nhất với giá ưu đãi. Giao hàng siêu tốc trong 2 giờ!
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 hover:scale-105 transition-all duration-300 shadow-lg">
                Mua ngay
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                Xem ưu đãi
              </button>
            </div>
          </div>

          {/* Floating food icons */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
            <div>
              <img
                src={strawberry || "/placeholder.svg"}
                alt="Thực phẩm"
                className="rounded-full w-72 h-72 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section ref={categoryRef} className="px-6 md:px-16 lg:px-32 py-12">
          <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
            Danh mục sản phẩm
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-amber-600 rounded-full"></span>
          </h2>
          <p className="text-gray-500 mt-4">Nhấn vào danh mục để xem sản phẩm</p>

          <div className="mt-10 flex flex-wrap items-center justify-start gap-6 md:gap-10">
            {categories.map((cat, index) => (
              <div key={cat.id} onClick={() => handleCategoryClick(cat.id)} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-full shadow-md group-hover:shadow-xl group-hover:shadow-amber-200 transition-all duration-300 ring-4 ring-transparent group-hover:ring-amber-400">
                  <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/20 transition-all duration-300 rounded-full z-10"></div>
                  <img
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.name}
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="text-center text-gray-700 text-base md:text-lg mt-4 font-medium transition-all duration-300 group-hover:text-amber-600 group-hover:font-semibold">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sale Section - FIXED: bg-linear-to-r */}
        <section ref={bestSellingRef} className="px-6 md:px-16 lg:px-32 py-12">
          <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
            Đang giảm giá
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-amber-600 rounded-full"></span>
          </h2>

          {bestSelling.length === 0 ? (
            <div className="mt-10 text-center text-gray-500">
              <p>Chưa có sản phẩm bán chạy.</p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {bestSelling.map((product) => (
                <div
                  key={product._id || product.id}
                  className="group bg-white rounded-2xl shadow-md p-4 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 cursor-pointer relative overflow-hidden"
                >
                  {product.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                      -{product.discount}%
                    </div>
                  )}

                  {/* FIXED: bg-linear-to-b */}
                  <div className="flex justify-center overflow-hidden rounded-xl bg-linear-to-b from-gray-50 to-gray-100 p-4">
                    <img
                      src={getProductImage(product) || "/placeholder.svg"}
                      alt={product.name}
                      className="w-32 h-32 object-contain transform group-hover:scale-125 transition-transform duration-700"
                    />
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-base font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-lg font-bold text-amber-600">
                            {(product.price * (1 - product.discount / 100)).toLocaleString()}đ
                          </span>
                          <span className="text-sm text-gray-400 line-through">{product.price.toLocaleString()}đ</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-amber-600">{product.price.toLocaleString()}đ</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Best Selling Section */}
        <section ref={bestSellingRef} className="px-6 md:px-16 lg:px-32 py-12">
          <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
            Bán chạy nhất
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-amber-600 rounded-full"></span>
          </h2>

          {bestSelling.length === 0 ? (
            <div className="mt-10 text-center text-gray-500">
              <p>Chưa có sản phẩm bán chạy.</p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {bestSelling.map((product) => (
                <div
                  key={product._id || product.id}
                  className="group bg-white rounded-2xl shadow-md p-4 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 cursor-pointer relative overflow-hidden"
                >
                  {product.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                      -{product.discount}%
                    </div>
                  )}

                  {/* FIXED: bg-linear-to-b */}
                  <div className="flex justify-center overflow-hidden rounded-xl bg-linear-to-b from-gray-50 to-gray-100 p-4">
                    <img
                      src={getProductImage(product) || "/placeholder.svg"}
                      alt={product.name}
                      className="w-32 h-32 object-contain transform group-hover:scale-125 transition-transform duration-700"
                    />
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-base font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-lg font-bold text-amber-600">
                            {(product.price * (1 - product.discount / 100)).toLocaleString()}đ
                          </span>
                          <span className="text-sm text-gray-400 line-through">{product.price.toLocaleString()}đ</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-amber-600">{product.price.toLocaleString()}đ</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* New Arrivals Section */}
        <section ref={newArrivalsRef} className="px-6 md:px-16 lg:px-32 py-12 bg-amber-50">
          <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
            Sản phẩm mới
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-amber-600 rounded-full"></span>
          </h2>

          {newArrivals.length === 0 ? (
            <div className="mt-10 text-center text-gray-500">
              <p>Chưa có sản phẩm mới.</p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {newArrivals.map((product, index) => (
                <div
                  key={product._id || product.id}
                  className="group bg-white rounded-2xl shadow-md p-4 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    MỚI
                  </div>

                  {product.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                      -{product.discount}%
                    </div>
                  )}

                  {/* FIXED: bg-linear-to-b */}
                  <div className="flex justify-center overflow-hidden rounded-xl bg-linear-to-b from-green-50 to-green-100 p-4">
                    <img
                      src={getProductImage(product) || "/placeholder.svg"}
                      alt={product.name}
                      className="w-32 h-32 object-contain transform group-hover:scale-125 transition-transform duration-700"
                    />
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-base font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-lg font-bold text-amber-600">
                            {(product.price * (1 - product.discount / 100)).toLocaleString()}đ
                          </span>
                          <span className="text-sm text-gray-400 line-through">{product.price.toLocaleString()}đ</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-amber-600">{product.price.toLocaleString()}đ</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Category Products Modal */}
        {showCategoryProducts && selectedCategoryData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">{selectedCategoryData.name}</h3>
                <button onClick={closeCategoryModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                  ✕
                </button>
              </div>
              <div className="p-6">
                {categoryProducts[selectedCategory]?.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">
                    <p>Chưa có sản phẩm trong danh mục này.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categoryProducts[selectedCategory]?.map((product) => (
                      <div
                        key={product._id || product.id}
                        className="group bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-center">
                          <img
                            src={getProductImage(product) || "/placeholder.svg"}
                            alt={product.name}
                            className="w-24 h-24 object-contain"
                          />
                        </div>
                        <div className="text-center mt-3">
                          <p className="font-medium text-gray-800 line-clamp-2">{product.name}</p>
                          <p className="text-amber-600 font-bold mt-1">
                            {product.price.toLocaleString()}đ
                            {product.unit && <span className="text-gray-500 font-normal">/{product.unit}</span>}
                          </p>
                        </div>
                        <div className="mt-3">
                          <Button product={product} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

export default Shop
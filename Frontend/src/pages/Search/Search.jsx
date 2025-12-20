"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button/Button";
import { Search, Frown } from "lucide-react";
import apiService from "../../services/api";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Sử dụng API service để tìm kiếm sản phẩm
      const response = await apiService.getProducts({
        search: searchTerm.trim(),
      });

      // Xử lý response từ API
      let productsArray = [];
      if (Array.isArray(response)) {
        productsArray = response;
      } else if (Array.isArray(response.data)) {
        productsArray = response.data;
      } else if (Array.isArray(response.products)) {
        productsArray = response.products;
      }

      setProducts(productsArray);
    } catch (err) {
      console.error("Error searching products:", err);
      setError(err.message || "Không thể tìm kiếm sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery(query);
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      performSearch(searchQuery.trim());
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getProductImage = (product) => {
    if (product.image) return product.image;
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === "string") return firstImage;
      if (firstImage?.url) return firstImage.url;
      if (firstImage?.image) return firstImage.image;
    }
    return "/placeholder.svg";
  };

  const getCategoryName = (product) => {
    if (typeof product.category === "string") return product.category;
    if (product.category_id?.name) return product.category_id.name;
    if (product.category?.name) return product.category.name;
    return "Chưa phân loại";
  };

  return (
    <main className="min-h-screen bg-gray-50 bg-linear-to-b from-white to-amber-50/20">
      <Navbar />

      <div className="pt-24 md:pt-26 px-4 sm:px-6 md:px-16 lg:px-32 pb-16">
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative flex items-center group">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full py-3 pl-12 pr-36 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm hover:shadow-md"
              />
              <Search
                className="absolute left-4.5 text-gray-400 group-focus-within:text-amber-600 transition-colors duration-300"
                size={24}
              />
              <button
                type="submit"
                className="absolute right-4 cursor-pointer bg-amber-600 text-white px-6 py-1.5 rounded-full hover:bg-amber-700 transition-all duration-300 font-semibold"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        <div>
          {loading ? ( // Trạng thái đang tải
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Có lỗi xảy ra
                </h2>
                <p className="mt-2 text-gray-600">{error}</p>
              </div>
            </div>
          ) : !query ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Tìm kiếm sản phẩm
                </h2>
                <p className="mt-2 text-gray-600">
                  Nhập từ khóa để tìm kiếm sản phẩm
                </p>
              </div>
            </div>
          ) : products.length === 0 ? ( // Trạng thái không có kết quả
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
                <Frown className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Không tìm thấy kết quả
                </h3>
                <p className="mt-1 text-sm text-gray-500 mb-4">
                  Không tìm thấy sản phẩm nào cho từ khóa "{query}"
                </p>
                <p className="text-sm text-gray-400">
                  Vui lòng thử với từ khóa khác
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Kết quả tìm kiếm cho:{" "}
                  <span className="text-amber-600">"{query}"</span>
                </h2>
                <p className="text-gray-600 mt-1">
                  Tìm thấy {products.length} sản phẩm
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product._id || product.id}
                    className="group bg-white rounded-2xl shadow-md p-4 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 cursor-pointer relative overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() =>
                      navigate(`/product/${product._id || product.id}`)
                    }
                  >
                    {product.discount > 0 && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                        -{product.discount}%
                      </div>
                    )}

                    <div className="relative w-full h-40 flex justify-center items-center overflow-hidden rounded-xl bg-gray-50 p-2">
                      <img
                        src={getProductImage(product) || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-contain transform group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-base font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getCategoryName(product)}
                      </p>
                      <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                        {product.discount > 0 ? (
                          <>
                            <span className="text-lg font-bold text-amber-600">
                              {(
                                product.price *
                                (1 - product.discount / 100)
                              ).toLocaleString()}
                              đ
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {product.price.toLocaleString()}đ
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-amber-600">
                            {product.price.toLocaleString()}đ
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                      <Button product={product} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default SearchPage;

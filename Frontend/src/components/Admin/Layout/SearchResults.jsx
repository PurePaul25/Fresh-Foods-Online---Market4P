import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Frown } from "lucide-react";
import Spinner from "./Spinner";
import { searchProducts } from "../../Admin/Layout/mockApi";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setLoading(true);
    setResults([]);

    if (query) {
      searchProducts(query)
        .then((data) => {
          setResults(data);
        })
        .catch((error) => {
          console.error("Lỗi khi tìm kiếm: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [query]); // Chạy lại effect mỗi khi 'query' thay đổi

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
        <Search className="mr-3" size={24} />
        {loading ? "Đang tìm kiếm..." : "Kết quả tìm kiếm cho:"}
        {!loading && (
          <span className="ml-2 font-bold text-amber-600">"{query}"</span>
        )}
      </h2>

      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : results.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tồn kho
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                      {product.id}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                      {product.name}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                      {product.category}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                      {product.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                      {product.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
            <Frown className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Không tìm thấy kết quả
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Vui lòng thử với một từ khóa khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;

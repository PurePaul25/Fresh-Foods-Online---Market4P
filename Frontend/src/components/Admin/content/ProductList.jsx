import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import ConfirmationModal from "../Layout/ConfirmationModal";
import apiService from "../../../services/api";

// Hàm helper để lấy class cho badge trạng thái
const getStatusBadge = (status) => {
  switch (status) {
    case "Còn hàng":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Sắp hết hàng":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Hết hàng":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function ProductList() {
  const navigate = useNavigate();
  // Lấy dữ liệu từ API
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo bộ lọc dựa trên dữ liệu sản phẩm thực tế
  const categories = useMemo(
    () => ["Tất cả", ...new Set(products.map((p) => p.category))],
    [products]
  );
  const statuses = useMemo(
    () => ["Tất cả", ...new Set(products.map((p) => p.status))],
    [products]
  );

  const [filters, setFilters] = useState({
    category: "Tất cả",
    status: "Tất cả",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số sản phẩm mỗi trang
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await apiService.getProducts();
        // Chuẩn hóa dữ liệu từ API backend: { success, data: [...], pagination }
        const normalized =
          Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.products)
            ? res.products
            : [];
        setProducts(normalized);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset về trang đầu khi thay đổi bộ lọc
  };

  // Lọc sản phẩm dựa trên state `filters`
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        filters.category === "Tất cả" || product.category === filters.category;
      const statusMatch =
        filters.status === "Tất cả" || product.status === filters.status;
      return categoryMatch && statusMatch;
    });
  }, [products, filters]);

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Logic xóa sản phẩm
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await apiService.deleteProduct(productToDelete._id || productToDelete.id);
        // Cập nhật UI bằng cách xóa sản phẩm khỏi state
        setProducts((prevProducts) =>
          prevProducts.filter(
            (p) =>
              (p._id || p.id) !== (productToDelete._id || productToDelete.id)
          )
        );
        toast.success(`Sản phẩm "${productToDelete.name}" đã được xóa.`);
        handleCloseModal();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        toast.error("Không thể xóa sản phẩm. Vui lòng thử lại!");
        handleCloseModal();
      }
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete?.name}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
      />
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Tất cả thực phẩm
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center cursor-pointer transition-colors duration-200 gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <Filter size={16} />
            Bộ lọc
          </button>
          <button
            onClick={() => navigate("/admin/dashboard/products/add")}
            className="flex items-center cursor-pointer transition-colors duration-200 gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600"
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Khu vực bộ lọc */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="category-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Danh mục
                </label>
                <select
                  id="category-filter"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Trạng thái
                </label>
                <select
                  id="status-filter"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Đang tải dữ liệu...
          </p>
        </div>
      ) : (
        <>
          {/* Bảng sản phẩm */}
          <motion.div
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Sản phẩm
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Danh mục
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Giá (VNĐ)
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Giảm giá
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Tồn kho
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  key={currentPage} // Thêm key để trigger lại animation khi chuyển trang
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <motion.tr
                          layout
                          key={product._id || product.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          variants={itemVariants}
                          exit={{
                            opacity: 0,
                            x: -50,
                            transition: { duration: 0.3 },
                          }}
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <div className="flex items-center gap-4">
                              <img
                                src={
                                  product.images?.[0]?.url ||
                                  product.img ||
                                  product.image
                                }
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/48";
                                }}
                              />
                              <div>
                                <div className="font-semibold">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {product._id || product.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {product.category ||
                              product.category_id?.name ||
                              "Không có danh mục"}
                          </td>
                          <td className="px-6 py-4">
                            {product.price.toLocaleString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {product.discount > 0 ? (
                              <span className="font-semibold text-red-500">{`${product.discount}%`}</span>
                            ) : (
                              "Không"
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {product.stock}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                product.status
                              )}`}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/dashboard/products/edit/${
                                      product._id || product.id
                                    }`
                                  )
                                }
                                className="p-2 rounded-full cursor-pointer duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition-colors"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(product)}
                                className="p-2 rounded-full cursor-pointer duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr>
                        <td
                          colSpan="7"
                          className="text-center py-10 text-gray-500 dark:text-gray-400"
                        >
                          Không tìm thấy sản phẩm nào phù hợp.
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center cursor-pointer duration-200 gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <ChevronLeft size={16} />
                  Trang trước
                </button>

                <div className="text-sm text-gray-700 dark:text-gray-400">
                  Trang <span className="font-semibold">{currentPage}</span>{" "}
                  trên <span className="font-semibold">{totalPages}</span>
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center cursor-pointer duration-200 gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Trang sau
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

export default ProductList;

import React, { useState, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ClipboardList,
  Search,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import { getProducts } from "../Layout/mockApi"; // Lấy dữ liệu sản phẩm giả lập
import UpdateStockModal from "./UpdateStockModal";

// --- Hàm và Component phụ ---

// Hàm helper để lấy class và text cho trạng thái tồn kho
const getStockStatus = (stock, lowStockThreshold) => {
  if (stock === 0) {
    return {
      text: "Hết hàng",
      badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
  }
  if (stock <= lowStockThreshold) {
    return {
      text: "Sắp hết",
      badge:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };
  }
  return {
    text: "Còn hàng",
    badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };
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

function Inventory() {
  const [products, setProducts] = useState(() => getProducts());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({
    key: "stock",
    direction: "asc",
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const sortedAndFilteredProducts = useMemo(() => {
    let filteredItems = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredItems;
  }, [products, searchTerm, sortConfig]);

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedAndFilteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedAndFilteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Logic sắp xếp
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Logic cập nhật tồn kho
  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleConfirmUpdate = (productId, quantityToAdd, newThreshold) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: p.stock + quantityToAdd,
              lowStockThreshold: newThreshold,
            }
          : p
      )
    );
    setModalOpen(false);

    const messages = [];
    if (quantityToAdd > 0) {
      messages.push(`nhập thêm ${quantityToAdd} sản phẩm`);
    }
    if (newThreshold !== selectedProduct.lowStockThreshold) {
      messages.push(`cập nhật ngưỡng sắp hết thành ${newThreshold}`);
    }
    toast.success(`Đã ${messages.join(" và ")} cho "${selectedProduct.name}".`);
  };

  const SortableHeader = ({ columnKey, title, className = "" }) => (
    <th scope="col" className={`px-6 py-3 ${className}`}>
      <button
        onClick={() => handleSort(columnKey)}
        className="flex items-center gap-1 group cursor-pointer"
      >
        {title}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          {sortConfig.key === columnKey ? (
            sortConfig.direction === "asc" ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )
          ) : (
            <ArrowDown size={14} className="text-gray-400" />
          )}
        </span>
      </button>
    </th>
  );

  return (
    <motion.div
      className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <UpdateStockModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        product={selectedProduct}
      />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList size={32} className="text-amber-500" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Quản lý Kho
          </h1>
        </div>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc ID sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-72 duration-200 transition pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Bảng tồn kho */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
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
                <SortableHeader columnKey="category" title="Danh mục" />
                <SortableHeader
                  columnKey="stock"
                  title="Tồn kho"
                  className="text-center"
                />
                <th scope="col" className="px-6 py-3 text-center">
                  Ngưỡng sắp hết
                </th>
                <SortableHeader columnKey="sold" title="Đã bán" />
                <th
                  scope="col"
                  className="px-6 py-3 text-center whitespace-nowrap"
                >
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => {
                const status = getStockStatus(
                  product.stock,
                  product.lowStockThreshold
                );
                return (
                  <motion.tr
                    layout
                    key={product.id}
                    className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                    variants={itemVariants}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.avatar}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-xs text-gray-500">
                            {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4 text-center font-bold text-lg text-gray-800 dark:text-gray-200">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 text-center text-red-600 dark:text-red-400 font-medium">
                      {product.lowStockThreshold}
                    </td>
                    <td className="px-6 py-4">{product.sold}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold leading-tight rounded-full ${status.badge}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenUpdateModal(product)}
                        className="p-2 rounded-full cursor-pointer duration-200 hover:bg-blue-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition-colors"
                        title="Cập nhật số lượng"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
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
              Trang <span className="font-semibold">{currentPage}</span> trên{" "}
              <span className="font-semibold">{totalPages}</span>
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
    </motion.div>
  );
}

export default Inventory;

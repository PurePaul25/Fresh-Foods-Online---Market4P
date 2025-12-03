import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Save,
  X,
  PackagePlus,
  Type,
  Tags,
  CircleDollarSign,
  Percent,
  FileText,
  Activity,
  Package,
  AlertTriangle,
  Bookmark,
} from "lucide-react";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Giả lập danh sách danh mục, trong thực tế sẽ lấy từ API
const categories = ["Trái cây", "Thịt", "Trứng", "Rau xanh", "Bánh mì", "Khác"];

// Component Input với Icon để tái sử dụng
const FormInput = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  ...props
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-10 pr-3 py-2 transition duration-200 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-amber-500"
      {...props}
    />
  </div>
);

// Cấu hình animation cho Framer Motion
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    discount: "",
    description: "",
    stock: "",
    lowStockThreshold: "",
    status: "Còn hàng", // Thêm trạng thái mặc định
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Tự động cập nhật trạng thái dựa trên tồn kho và ngưỡng
  useEffect(() => {
    const stock = parseInt(product.stock, 10);
    const threshold = parseInt(product.lowStockThreshold, 10);

    // isNaN(stock) để xử lý khi người dùng xóa sạch input
    let newStatus = "Còn hàng";
    if (isNaN(stock) || stock === 0) {
      newStatus = "Hết hàng";
    } else if (stock > 0 && !isNaN(threshold) && stock <= threshold) {
      newStatus = "Sắp hết hàng";
    }

    if (product.status !== newStatus) {
      setProduct((prevProduct) => ({ ...prevProduct, status: newStatus }));
    }
  }, [product.stock, product.lowStockThreshold, product.status]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Vui lòng chọn một file hình ảnh hợp lệ.");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (
      !product.name ||
      !product.category ||
      !product.brand ||
      !product.price || // price có thể là 0
      product.stock === "" || // stock có thể là 0
      product.lowStockThreshold === "" ||
      !product.status
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }
    if (!imageFile) {
      toast.error("Vui lòng tải lên hình ảnh sản phẩm!");
      return;
    }

    // Giả lập quá trình lưu
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        console.log("Đã lưu sản phẩm:", {
          ...product,
          stock: parseInt(product.stock, 10) || 0,
          discount: product.discount || 0,
          lowStockThreshold: parseInt(product.lowStockThreshold, 10) || 0,
          image: imageFile.name,
        });
        resolve();
      }, 1500);
    });

    toast.promise(promise, {
      loading: "Đang thêm sản phẩm...",
      success: () => {
        navigate("/admin/dashboard/products");
        return <b>Sản phẩm đã được thêm thành công!</b>;
      },
      error: <b>Không thể thêm sản phẩm.</b>,
    });
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"
        >
          <PackagePlus size={30} />
          Thêm thực phẩm mới
        </motion.h2>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8"
        variants={itemVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột thông tin */}
          <div className="md:col-span-2 space-y-8">
            <fieldset className="space-y-6">
              <legend className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Thông tin cơ bản
              </legend>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Tên sản phẩm
                </label>
                <FormInput
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Thịt bò Wagyu"
                  icon={<Type size={18} />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Danh mục
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Tags size={18} />
                    </div>
                    <select
                      id="category"
                      name="category"
                      value={product.category}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 transition duration-200 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-amber-500"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Thương hiệu
                  </label>
                  <FormInput
                    id="brand"
                    name="brand"
                    value={product.brand}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: HIKAN"
                    icon={<Bookmark size={18} />}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Giá sản phẩm
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Giá (VNĐ)
                  </label>
                  <FormInput
                    id="price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 250000"
                    min="0"
                    icon={<CircleDollarSign size={18} />}
                  />
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Giảm giá (%) (nếu có)
                  </label>
                  <FormInput
                    id="discount"
                    name="discount"
                    type="number"
                    value={product.discount}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 8"
                    min="0"
                    max="100"
                    icon={<Percent size={18} />}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Quản lý kho
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Tồn kho ban đầu
                  </label>
                  <FormInput
                    id="stock"
                    name="stock"
                    type="number"
                    value={product.stock}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 100"
                    min="0"
                    icon={<Package size={18} />}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lowStockThreshold"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Ngưỡng sắp hết
                  </label>
                  <FormInput
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    type="number"
                    value={product.lowStockThreshold}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 10"
                    min="0"
                    icon={<AlertTriangle size={18} />}
                  />
                </div>
              </div>
            </fieldset>
          </div>

          {/* Cột hình ảnh */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Hình ảnh sản phẩm
            </label>
            <div
              className="mt-1 flex justify-center items-center duration-200 h-full min-h-[300px] md:min-h-full px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-amber-500 dark:hover:border-amber-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative group w-full">
                    <img
                      src={imagePreview}
                      alt="Xem trước"
                      className="mx-auto max-h-48 w-auto object-contain rounded-md"
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X size={16} />
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud
                      className="mx-auto h-12 w-12 text-gray-400"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nhấn để tải lên hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Hàng mô tả */}
          <div className="md:col-span-3">
            <fieldset>
              <legend className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Mô tả
              </legend>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                  <FileText size={18} />
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={product.description}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 transition duration-200 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-amber-500"
                  placeholder="Mô tả chi tiết về sản phẩm, nguồn gốc, đặc điểm..."
                ></textarea>
              </div>
            </fieldset>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-4 pt-8 mt-8 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard/products")}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            <X size={16} /> Hủy
          </button>
          <button
            type="submit"
            className="flex items-center cursor-pointer gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <Save size={16} /> Lưu sản phẩm
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default AddProduct;

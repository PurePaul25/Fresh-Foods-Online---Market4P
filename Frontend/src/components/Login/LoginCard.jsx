import React, { useState, useRef, useEffect } from "react";
import Logo from "./Logo";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, UserRound, Check, X } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { loginUser, registerUser } from "../../services/authApi";

// Component nhỏ để hiển thị độ mạnh mật khẩu
const PasswordStrengthMeter = ({ password = "" }) => {
  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return score;

    // 1. Điểm từ độ dài (tối đa 25 điểm)
    score += Math.min(pass.length * 2.5, 25);

    // 2. Điểm từ các loại ký tự
    const variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
    };
    if (variations.lower) score += 15; // Chữ thường: điểm vừa
    if (variations.upper) score += 25; // Chữ hoa: điểm cao
    if (variations.digits) score += 25; // Số: điểm cao

    // 3. Điểm thưởng nếu mật khẩu đủ tốt (dài và đa dạng)
    const variationCount = Object.values(variations).filter(Boolean).length;
    if (pass.length >= 8 && variationCount >= 3) {
      score += 15;
    }

    // Đảm bảo điểm không vượt quá 100
    return Math.min(score, 100);
  };

  const score = calculateStrength(password);
  let label = "";
  let color = "bg-gray-200";
  let textColor = "";

  if (score > 0 && score < 40) {
    label = "Chưa ổn lắm";
    color = "bg-red-500";
    textColor = "text-red-500";
  } else if (score >= 40 && score < 75) {
    label = "Trông cũng tạm được á!";
    color = "bg-yellow-500";
    textColor = "text-yellow-500";
  } else if (score >= 75) {
    label = "Quá okela luôn nha!";
    color = "bg-green-500";
    textColor = "text-green-500";
  }

  const requirements = [
    { label: "Ít nhất 6 ký tự", satisfied: password.length >= 6 },
    {
      label: "Có ít nhất một chữ thường (a-z)",
      satisfied: /[a-z]/.test(password),
    },
    {
      label: "Có ít nhất một chữ hoa (A-Z)",
      satisfied: /[A-Z]/.test(password),
    },
    { label: "Có ít nhất một số (0-9)", satisfied: /\d/.test(password) },
  ];

  if (password.length === 0) return null;

  return (
    <div className="mt-2 space-y-2 transition-all duration-300">
      {/* Thanh tiến trình */}
      <div className="flex w-full h-2 rounded-full overflow-hidden bg-gray-200">
        <div
          className={`transition-all duration-300 ${color}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>

      {/* Nhãn trạng thái */}
      {label && (
        <p
          className={`text-xs text-right font-medium transition-colors duration-300 ${textColor}`}
        >
          Độ mạnh: {label}
        </p>
      )}

      {/* Danh sách yêu cầu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {requirements.map((req, index) => (
          <div
            key={index}
            className={`flex items-center transition-colors duration-300 ${
              req.satisfied ? "text-green-600" : "text-gray-500"
            }`}
          >
            {req.satisfied ? (
              <Check className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function LoginCard() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState("login"); // 'login', 'register', 'forgotPassword'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // Register state
  const [regUser, setRegUser] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Refs để đo chiều cao của các form
  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);
  const forgotFormRef = useRef(null);
  // State để lưu chiều cao động của container
  const [containerHeight, setContainerHeight] = useState("auto");

  // Effect để cập nhật chiều cao của container dựa trên form đang hoạt động
  useEffect(() => {
    const updateHeight = () => {
      if (formState === "login" && loginFormRef.current) {
        setContainerHeight(`${loginFormRef.current.scrollHeight}px`);
      } else if (formState === "register" && registerFormRef.current) {
        setContainerHeight(`${registerFormRef.current.scrollHeight}px`);
      } else if (formState === "forgotPassword" && forgotFormRef.current) {
        setContainerHeight(`${forgotFormRef.current.scrollHeight}px`);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [formState]);

  function validate() {
    if (!email && !password) return "Vui lòng nhập email và mật khẩu!";
    if (!email) return "Vui lòng nhập email!";
    if (!password) return "Vui lòng nhập mật khẩu!";
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) return "Email không hợp lệ!";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return toast.error(v);
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      // Lưu user info với role vào localStorage
      const userInfo = {
        email: email,
        name: result.displayName,
        role: result.role,
        accessToken: result.accessToken,
      };
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("accessToken", result.accessToken);

      // Chuẩn bị thông điệp chào mừng
      const successMessage = `Đăng nhập thành công! Chào mừng ${result.displayName}.`;
      sessionStorage.setItem("loginSuccessMessage", successMessage);

      // Điều hướng
      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

      // Làm trống form
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  function validateRegister() {
    if (
      !regUser ||
      !regLastName ||
      !regFirstName ||
      !regEmail ||
      !regPassword ||
      !regConfirmPassword
    )
      return "Vui lòng nhập đầy đủ thông tin!";
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Kiểm tra các yêu cầu về mật khẩu
    if (!re.test(String(regEmail).toLowerCase())) return "Email không hợp lệ!";
    if (regPassword.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự!";
    if (!/[a-z]/.test(regPassword))
      return "Mật khẩu phải chứa ít nhất một chữ thường!";
    if (!/[A-Z]/.test(regPassword))
      return "Mật khẩu phải chứa ít nhất một chữ hoa!";
    if (!/\d/.test(regPassword)) return "Mật khẩu phải chứa ít nhất một số!";
    if (regPassword !== regConfirmPassword)
      return "Mật khẩu xác nhận không khớp!";
    return "";
  }

  async function handleRegister(e) {
    e.preventDefault();
    const v = validateRegister();
    if (v) return toast.error(v);
    setRegLoading(true);

    try {
      await registerUser(
        regUser,
        regEmail,
        regFirstName, // Sửa: Gửi đi firstName
        regLastName, // Sửa: Gửi đi lastName
        regPassword,
        regConfirmPassword
      );

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setFormState("login");

      // Làm trống form đăng ký
      setRegUser("");
      setRegLastName("");
      setRegFirstName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại");
    } finally {
      setRegLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!forgotEmail) return toast.error("Vui lòng nhập email!");
    if (!re.test(String(forgotEmail).toLowerCase()))
      return toast.error("Email không hợp lệ!");

    setForgotLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setForgotLoading(false);
    toast.success(
      `Đã gửi liên kết đặt lại mật khẩu đến email: ${forgotEmail}.`
    );
    // Làm trống form quên mật khẩu
    setForgotEmail("");
  }

  return (
    <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-8 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <Logo />
        <div className="font-semibold text-right">
          <h1 className="text-lg sm:text-2xl font-bold">
            {formState === "login" && "Chào mừng trở lại"}
            {formState === "register" && "Đăng ký tài khoản"}
            {formState === "forgotPassword" && "Quên mật khẩu"}
          </h1>
          <p className="text-sm text-gray-500">
            {formState === "login" && "Hãy đăng nhập để tiếp tục!"}
            {formState === "register" && "Tạo tài khoản để sử dụng dịch vụ!"}
            {formState === "forgotPassword" &&
              "Nhập email để nhận liên kết đặt lại mật khẩu."}
          </p>
        </div>
      </div>
      <div
        className="relative overflow-hidden transition-[height] duration-500 ease-in-out"
        style={{ height: containerHeight }}
      >
        <div
          className={`absolute w-full top-0 left-0 transition-all duration-500 ease-in-out ${
            formState === "login"
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full pointer-events-none invisible"
          }`} // Gán ref cho div chứa form Login
        >
          {/* Login Form */}
          <form
            ref={loginFormRef}
            onSubmit={handleSubmit}
            className="space-y-4 mx-2"
          >
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              rightNode={
                <span className="text-gray-500">
                  <Mail />
                </span>
              }
            />

            <FormInput
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              rightNode={
                <span className="flex items-center gap-2 text-gray-400">
                  <button
                    type="button"
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </span>
              }
            />

            <div className="flex items-center justify-between text-sm text-gray-500 py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded accent-amber-500 cursor-pointer"
                />
                <span className="hover:text-amber-500 transition-all duration-300">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <button
                type="button"
                onClick={() => setFormState("forgotPassword")}
                className="hover:underline hover:text-amber-500 transition-all duration-300 cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 cursor-pointer rounded-xl bg-linear-to-r from-indigo-600 to-amber-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : null}
              <span>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</span>
            </button>
            <div className="flex items-center gap-4 pt-2">
              <hr className="w-full border-gray-300" />
              <p className="text-gray-500 text-sm whitespace-nowrap">
                Hoặc với
              </p>
              <hr className="w-full border-gray-300" />
            </div>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="p-3 border-2 border-gray-200 rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:border-red-400 hover:text-red-500 transition-all duration-300"
                onClick={() => alert("Tính năng này sớm sẽ được thêm vào sau!")}
              >
                <FaGoogle />
              </a>
            </div>
          </form>
        </div>
        <div
          className={`absolute w-full top-0 left-0 transition-all duration-500 ease-in-out ${
            formState === "register"
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full pointer-events-none invisible"
          }`}
        >
          {/* Gán ref cho div chứa form Register */}
          {/* Register Form */}
          <form
            ref={registerFormRef}
            onSubmit={handleRegister}
            className="space-y-4 mx-2"
          >
            <FormInput
              label="Tên người dùng"
              type="text"
              value={regUser}
              onChange={(e) => setRegUser(e.target.value)}
              placeholder="Nhập tên người dùng"
              rightNode={
                <span className="text-gray-500">
                  <UserRound />
                </span>
              }
            />

            {/* Thêm 2 ô Họ và Tên */}
            <div className="flex gap-6">
              <div className="flex-2">
                {" "}
                {/* Chiếm 3 phần */}
                <FormInput
                  label="Họ"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  placeholder="Nguyễn Văn"
                />
              </div>
              <div className="flex-1">
                {" "}
                {/* Chiếm 1 phần */}
                <FormInput
                  label="Tên"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  placeholder="An"
                />
              </div>
            </div>

            <FormInput
              label="Email"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="example@gmail.com"
              rightNode={
                <span className="text-gray-500">
                  <Mail />
                </span>
              }
            />

            <FormInput
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              rightNode={
                <span className="flex items-center gap-2 text-gray-400">
                  <button
                    type="button"
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </span>
              }
            />
            {/* Thêm thanh trạng thái mật khẩu */}
            <PasswordStrengthMeter password={regPassword} />

            <FormInput
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              rightNode={
                <span className="flex items-center gap-2 text-gray-400">
                  <button
                    type="button"
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </span>
              }
            />

            <button
              disabled={regLoading}
              className="w-full py-3 mt-6 cursor-pointer rounded-xl bg-linear-to-r from-indigo-600 to-amber-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {regLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : null}
              <span>{regLoading ? "Đang đăng ký..." : "Đăng ký"}</span>
            </button>
            <div className="flex items-center gap-4 pt-2">
              <hr className="w-full border-gray-300" />
              <p className="text-gray-500 text-sm whitespace-nowrap">
                Hoặc với
              </p>
              <hr className="w-full border-gray-300" />
            </div>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="p-3 border-2 border-gray-200 rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:border-red-400 hover:text-red-500 transition-all duration-300"
                onClick={() => alert("Tính năng này sớm sẽ được thêm vào sau!")}
              >
                <FaGoogle />
              </a>
            </div>
          </form>
        </div>
        {/* Forgot Password Form */}
        <div
          className={`absolute w-full top-0 left-0 transition-all duration-500 ease-in-out ${
            formState === "forgotPassword"
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full pointer-events-none invisible"
          }`}
        >
          <form
            ref={forgotFormRef}
            onSubmit={handleForgotPassword}
            className="space-y-4 mx-2"
          >
            <FormInput
              label="Email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Nhập email đã đăng ký"
              rightNode={
                <span className="text-gray-500">
                  <Mail />
                </span>
              }
            />

            <button
              disabled={forgotLoading}
              className="w-full py-3 mt-6 cursor-pointer rounded-xl bg-linear-to-r from-indigo-600 to-amber-500 text-white font-semibold transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {forgotLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : null}
              <span>
                {forgotLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
              </span>
            </button>
          </form>
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-gray-500">
        {formState === "login" ? (
          <>
            <span>Bạn chưa có tài khoản?</span>
            <button
              type="button"
              className="ml-2 text-amber-500 font-medium hover:underline hover:text-amber-600 transition-all duration-300 cursor-pointer"
              onClick={() => setFormState("register")}
            >
              Đăng ký
            </button>
          </>
        ) : formState === "register" ? (
          <>
            <span>Bạn đã có tài khoản?</span>
            <button
              type="button"
              className="ml-2 text-amber-500 font-medium hover:underline hover:text-amber-600 transition-all duration-300 cursor-pointer"
              onClick={() => setFormState("login")}
            >
              Đăng nhập
            </button>
          </>
        ) : (
          // formState === 'forgotPassword'
          <>
            <span>Bạn đã nhớ ra mật khẩu rồi?</span>
            <button
              type="button"
              className="ml-2 text-amber-500 font-medium hover:underline hover:text-amber-600 transition-all duration-300 cursor-pointer"
              onClick={() => setFormState("login")}
            >
              Quay lại Đăng nhập
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginCard;

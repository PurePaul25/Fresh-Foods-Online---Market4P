import { NavLink } from "react-router-dom";
import { Store, ShoppingCart, Search } from "lucide-react";

function Navbar() {
  return (
    <main className="fixed z-10 left-0 right-0 flex justify-around px-10 py-4 font-semibold text-white bg-[#051922]">
      <div className="flex gap-x-0.5 items-center text-amber-600">
        <div>
          <Store size={37}></Store>
        </div>
        <div className="-mt-0.5">
          <h2 className="text-lg font-bold">Market4P</h2>
          <h3 className="text-[0.7rem] -mt-1.5">Fresh Fruits Online</h3>
        </div>
      </div>
      <nav className="flex gap-x-4 items-center justify-around">
        <div className="px-4 py-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-amber-600" : "hover:text-amber-600"
            }
          >
            Trang chủ
          </NavLink>
        </div>

        <div className="px-4 py-3">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-amber-600" : "hover:text-amber-600"
            }
          >
            Giới thiệu
          </NavLink>
        </div>

        <div className="px-4 py-3">
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-amber-600" : "hover:text-amber-600"
            }
          >
            Liên hệ
          </NavLink>
        </div>

        <div className="px-4 py-3">
          <NavLink
            to="/checkout"
            className={({ isActive }) =>
              isActive ? "text-amber-600" : "hover:text-amber-600"
            }
          >
            Thanh toán
          </NavLink>
        </div>

        <div className="px-4 py-3">
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "text-amber-600" : "hover:text-amber-600"
            }
          >
            Cửa hàng
          </NavLink>
        </div>
      </nav>

      <div className="flex gap-x-3 items-center">
        <NavLink
          to="/cart"
          className="p-2 hover:text-amber-600 hover:cursor-pointer"
        >
          <ShoppingCart />
        </NavLink>
        <div className="p-2 hover:text-amber-600 hover:cursor-pointer">
          <Search />
        </div>
      </div>
    </main>
  );
}

export default Navbar;

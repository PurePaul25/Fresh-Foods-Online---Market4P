import React from "react";
import { Store } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-x-1 text-amber-600">
      <div>
        <Store size={36} strokeWidth={2} />
      </div>
      <div className="-mt-0.5 leading-tight">
        <h2 className="text-lg font-bold">Market4P</h2>
        <h3 className="text-[0.7rem] -mt-0.5 tracking-wide">
          Fresh Foods Online
        </h3>
      </div>
    </div>
  );
}

export default Logo;

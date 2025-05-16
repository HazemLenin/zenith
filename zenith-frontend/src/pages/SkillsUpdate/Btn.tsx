import React from "react";

type BtnProps = {
  btnName: string;
  btnFun: () => void;
  variant?: "ok" | "no";
};

const Btn: React.FC<BtnProps> = ({ btnName, btnFun, variant }) => {
  const baseStyle = "px-4 py-2 rounded font-semibold";
  const variantStyle =
    variant === "ok"
      ? "bg-green-500 text-white"
      : variant === "no"
      ? "bg-red-500 text-white"
      : "bg-blue-500 text-white";

  return (
    <button onClick={btnFun} className={`${baseStyle} ${variantStyle}`}>
      {btnName}
    </button>
  );
};

export default Btn;

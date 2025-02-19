const Button = ({ children, className, onClick, variant, size, loading, disabled }) => {
  const styles =
    variant === "kokowai"
      ? "bg-kokowai text-white shadow-[0px_4px_8px_0px_#00000026,0px_1px_3px_0px_#0000004c]"
      : "bg-gray-100 text-kokowai border border-kokowai";

  const width = size === "small" ? "w-fit" : "w-[316px]";

  return (
    <button
      className={`rounded-[5px] font-medium text-[16px] leading-4 p-4 cursor-pointer ${styles} ${width} ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {children}
    </button>
  );
};

export default Button;

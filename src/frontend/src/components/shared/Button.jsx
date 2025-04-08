const Button = ({ children, className, onClick, variant, size, loading, disabled }) => {
  const styles =
    variant === "kokowai"
      ? "bg-kokowai text-white shadow-digitaonga"
      : "bg-gray-100 text-kokowai border border-kokowai";

  const width = size === "small" ? "w-fit" : "w-[316px]";

  return (
    <button
      className={`rounded-[5px] font-medium text-[16px] leading-4 p-4 cursor-pointer ${styles} ${width} disabled:bg-gray-100 disabled:border-none disabled:text-gray-500 disabled:cursor-default ${className} custom__button`}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {children}
    </button>
  );
};

export default Button;

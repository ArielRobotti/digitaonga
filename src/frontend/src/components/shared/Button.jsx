const Button = ({ children, className, onClick }) => {
  return (
    <button
      className={`bg-gray-100 rounded-[5px] border-kokowai text-kokowai font-bold text-[16px] leading-4 p-4 w-[166px] cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

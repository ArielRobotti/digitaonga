const Button = ({ children }) => {
  return (
    <button className="bg-gray-100 rounded-[5px] border-kokowai uppercase text-kokowai font-bold text-[16px] leading-4 p-4 w-[166px]">
      {children}
    </button>
  );
};

export default Button;

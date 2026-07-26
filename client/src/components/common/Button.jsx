const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) => {
  const variants = {
    primary: "bg-[#4F7CFF] hover:bg-[#3B6EF6] text-white shadow-md shadow-[#4F7CFF]/20 hover:-translate-y-0.5",
    secondary: "bg-transparent border border-[#334155] text-[#CBD5E1] hover:bg-[#4F7CFF]/15 hover:border-[#4F7CFF] hover:text-white",
    danger: "bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-md shadow-[#EF4444]/20",
    success: "bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-md shadow-[#22C55E]/20",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        px-5
        py-2.5
        rounded-[12px]
        text-sm
        font-semibold
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:transform-none
        flex
        items-center
        justify-center
        gap-2
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
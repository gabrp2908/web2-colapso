const URULogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-16 h-16", md: "w-12 h-12", lg: "w-16 h-16" };
  return <img src="/uru-logo.png" alt="URU Logo" className={sizes[size]} />;
};

export default URULogo;

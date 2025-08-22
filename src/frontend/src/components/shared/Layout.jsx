import { useLocation } from "react-router";
import Header from "./Header";

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Rutas donde NO se muestra el header ni el padding
  const noHeaderPaddingPages = ["/login"];
  const needsHeaderPadding = !noHeaderPaddingPages.includes(location.pathname);

  return (
    <>
      {needsHeaderPadding && <Header />}
      <div
        className={`min-h-screen w-full ${needsHeaderPadding ? "pt-[60px] xl:pt-[70px]" : ""}`}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;

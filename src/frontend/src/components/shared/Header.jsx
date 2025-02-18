import { BurgerMenu } from "../ui/icons";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";

const links = [
  { title: "NFT’s", link: "/nfts" },
  { title: "Proposals", link: "/proposals" },
  { title: "Community", link: "/community" },
  { title: "Profile", link: "/profile" },
  { title: "About Digitaonga", link: "/about" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <header className="h-[60px] w-screen bg-kokowai text-white flex items-center fixed top-0">
      <div className="basis-1/3 pl-4">
        <BurgerMenu className="cursor-pointer" onClick={toggleMenu} />
      </div>

      <h2 className="basis-1/3">HEADLINE</h2>

      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-[60px] left-0 z-20 bg-kokowai text-white pt-[60px] h-[calc(100vh-60px)] w-full bg-primary text-primary-foreground"
      >
        <nav className="p-4">
          <ul className="space-y-4 grid place-items-center gap-[60px]">
            {links.map(({ title, link }) => (
              <li key={title}>
                <h2 onClick={toggleMenu}>
                  <NavLink to={link}>{title}</NavLink>
                </h2>
              </li>
            ))}
            {/* TODO (fran): hacer logica de login/logout aca */}
            <li>
              <h2 className="cursor-pointer" onClick={toggleMenu}>
                Log In / Log Out
              </h2>
            </li>
          </ul>
        </nav>
      </motion.aside>
    </header>
  );
};

export default Header;

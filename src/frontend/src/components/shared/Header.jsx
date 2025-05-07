import { BellIcon, BurgerMenu } from "../ui/icons";
import { NavLink, useNavigate } from "react-router";

import Badge from "@mui/material/Badge";
import { motion } from "framer-motion";
import useMember from "../../hooks/useMember";
import useNotification from "../../store/useNotifications";
import { useState } from "react";

const links = [
  { title: "Digital Taonga", link: "/digital-taonga" },
  { title: "Proposals", link: "/proposals" },
  { title: "Community", link: "/community" },
  { title: "Profile", link: "/profile" },
  { title: "About Digitaonga", link: "/about" },
  // { title: "Log In", link: "/login" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications } = useNotification();
  const { connect, disconnect, user } = useMember();

  const toggleMenu = () => setOpen(!open);
  const handleLogin = () => (user ? disconnect() : connect());

  return (
    <header className="h-[60px] w-screen bg-kokowai text-white flex items-center fixed top-0">
      <div className="basis-1/3 pl-4">
        <BurgerMenu className="cursor-pointer" onClick={toggleMenu} />
      </div>

      <h2 className="basis-1/3 text-center">HEADLINE</h2>

      <Badge
        badgeContent={notifications?.length || 0}
        color="primary"
        className="basis-1/3 flex justify-end mr-4"
      >
        <BellIcon className="cursor-pointer" onClick={() => navigate("/notifications")} />
      </Badge>

      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-[60px] left-0 bg-kokowai text-white pt-[60px] h-[calc(100vh-60px)] w-full bg-primary text-primary-foreground !z-50"
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
              <h2 className="cursor-pointer" onClick={handleLogin}>
                {user ? "Log out" : "Log in"}
              </h2>
            </li>
          </ul>
        </nav>
      </motion.aside>
    </header>
  );
};

export default Header;

import { BellIcon, BurgerMenu, UserIcon } from "../ui/icons";
import { NavLink, useNavigate } from "react-router";
import { p2str, shortP } from "../../utils/functions";

import Badge from "@mui/material/Badge";
import Button from "./Button";
import { motion } from "framer-motion";
import useMember from "../../hooks/useMember";
import useMemberStore from "../../store/useMemberStore"
import useNotification from "../../store/useNotifications";
import { useState } from "react";


const Header = () => {
  // Store
  const navigate = useNavigate();
  const { notifications } = useNotification();
  const { connect, disconnect, user } = useMember();
  const { member } = useMemberStore()
  
  const links = [
    { title: "Digital Taonga", link: "/digital-taonga" },
    { title: "Proposals", link: "/proposals" },
    { title: "Community", link: "/community" },
    { title: "Profile", link:  member? "/profile": "/"},
    { title: "FAQ", link: "/faqs" },
    // { title: "Log In", link: "/login" },
  ];
  
  const desktopLinks = [
    { title: "Community", link: "/community" },
    { title: "Calendar", link: "/calendar" },
    { title: "Proposals", link: "/proposals" },
    { title: "Profile", link: member? "/profile": "/" },
    { title: "FAQ", link: "/faqs" },
  ];

  // State
  const [open, setOpen] = useState(false); // Menu open/close state (view mobile)

  // Handlers
  const toggleMenu = () => setOpen(!open);
  const handleLogin = () => (user ? disconnect() : connect());

  return (
    <header className="h-[60px] xl:h-[70px] w-screen bg-kokowai text-white flex xl:justify-between items-center fixed top-0 xl:px-4 z-10">
      {/* Burger menu for mobile view */}
      <div className="basis-1/3 pl-4 xl:hidden">
        <BurgerMenu className="cursor-pointer" onClick={toggleMenu} />
      </div>

      <h2 className="basis-1/3 text-center xl:hidden">HEADLINE</h2>

      {/* Notifications */}
      <Badge
        badgeContent={notifications?.length || 0}
        color="primary"
        className="basis-1/3 flex justify-end mr-4 xl:hidden!"
      >
        <BellIcon className="cursor-pointer" onClick={() => navigate("/notifications")} />
      </Badge>

      {/* Mobile menu */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-[60px] left-0 bg-kokowai text-white pt-[60px] h-[calc(100vh-60px)] w-full bg-primary text-primary-foreground !z-50 max-w-[556px] xl:hidden"
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

            <li>
              <h2 className="cursor-pointer" onClick={handleLogin}>
                {user ? "Log out" : "Log in"}
              </h2>
            </li>
          </ul>
        </nav>
      </motion.aside>

      {/* Start desktop header */}
      <img
        src="/images/png/digitaonga logo header.png"
        alt="digitaonga"
        className="hidden xl:block"
      />

      <nav className="hidden xl:block w-full">
        <ul className="flex gap-4 justify-center items-center w-full">
          {desktopLinks.map(({ title, link }) => (
            <li key={title}>
              <NavLink to={link} className="text-lg">
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Button
        className="hidden xl:flex w-[173px]! justify-center items-center gap-2"
        onClick={handleLogin}
      >
        {user ? (
          <>
            {shortP(p2str(user.principal))}
            <UserIcon />
          </>
        ) : (
          "Log in"
        )}
      </Button>
    </header>
  );
};

export default Header;

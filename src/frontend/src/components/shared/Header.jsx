import { BellIcon, BurgerMenu, UserIcon } from "../ui/icons";
import { NavLink, useNavigate } from "react-router";
import { blobToImageUrl } from "../../utils/imageManager";
import { p2str, shortP } from "../../utils/functions";

import Badge from "@mui/material/Badge";
import Button from "./Button";
import { motion } from "framer-motion";
import useMember from "../../hooks/useMember";
import useMemberStore from "../../store/useMemberStore"
import useNotification from "../../store/useNotifications";
import { useState } from "react";
// import ThemeToggle from "../../components/ThemeToggle"


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
    { title: "Profile", link: user ? "/profile" : "/" },
    { title: "FAQ", link: "/faqs" },
    // { title: "Calendar", link: "/calendar" },
    // { title: "Log In", link: "/login" },
  ];

  const desktopLinks = [
    { title: "Digital Taonga", link: "/digital-taonga" },
    { title: "Proposals", link: "/proposals" },
    { title: "Community", link: "/community" },
    { title: "Profile", link: user ? "/profile" : "/" },
    { title: "FAQ", link: "/faqs" },
    // { title: "Calendar", link: "/calendar" },
  ];

  // State
  const [open, setOpen] = useState(false); // Menu open/close state (view mobile)
  const [headline, setHeadline] = useState("")

  // Handlers
  const toggleMenu = (title = headline) => {
    setOpen(!open);
  }

  const handleSelectContent = (title) => {
    setHeadline(title.toUpperCase())
    setOpen(false)

  }
  const handleLogin = () => (user ? disconnect() : connect());

  return (
    <header className="h-[60px] xl:h-[70px] w-screen bg-kokowai text-white flex xl:justify-between items-center fixed top-0 xl:px-4 z-10">
      {/* Burger menu for mobile view */}
      <div className="xl:hidden w-full flex flex-row justify-between items-center">
        <div className=" pl-4 ">
          <BurgerMenu className="cursor-pointer" onClick={() => toggleMenu()} />
        </div>

        <h3 className="  text-center ">{headline}</h3>

        {/* Notifications */}
        <Badge
          badgeContent={notifications?.length || 0}
          color="primary"
          className="flex justify-end mr-4 !"
          onClick={() => handleSelectContent("notifications")}
        >
          <BellIcon className="cursor-pointer" onClick={() => navigate("/notifications")} />
        </Badge>
      </div>

      {/* Mobile menu */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: open ? -2 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-[60px] left-0 bg-kokowai text-white py-4 rounded-b-xl
          w-full bg-primary text-primary-foreground !z-50 max-w-[75vw] xl:hidden"
      >
        <nav className="flex flex-col p-4 pl-10">
          <ul className=" grid gap-6 ">
            {links.map(({ title, link }) => (
              <li key={title}>
                <h2 className="text-[18px]" onClick={() => handleSelectContent(title)}>
                  <NavLink to={link}>{title}</NavLink>
                </h2>
              </li>
            ))}

            <li>
              <h2 className="text-[18px] cursor-pointer" onClick={handleLogin}>
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
        className="hidden xl:block h-14 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <nav className="hidden xl:block w-full">
        <ul className="flex gap-6 justify-around items-center w-full px-[8vw]">
          {desktopLinks.map(({ title, link }) => (
            <li key={title} className="transition duration-300 ease-in-out
              hover:scale-[1.1]"
              onClick={() => handleSelectContent(title)}
            >
              <NavLink to={link} className="text-lg ">
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* <ThemeToggle className="mx-6"/> */}

      <Button
        className="hidden xl:flex w-[173px] justify-center items-center p-0 h-12 xl:mr-2"
        onClick={handleLogin}
      >
        {user ? (
          <div className="flex flex-row items-center justify-between w-full">
            <span className="text-[20px] truncate">
              {member.data?.name[0] ? member.data.name[0].slice(0, 16) : "No Name"}
            </span>

            {member.data?.profile_pic[0] ? (
              <img
                src={blobToImageUrl(member.data?.profile_pic[0])}
                className="object-cover rounded-full w-10 h-10"
                alt="Profile"
              />
            ) : (
              <UserIcon className="w-8 h-8" />
            )}
          </div>
        ) : (
          "Log in"
        )}
      </Button>
    </header>
  );
};

export default Header;

import React from "react";
import useAuthUser from "../../hooks/useAuthUser";
import { useLocation } from "react-router";
import {
  Glasses,
  HomeIcon,
  UsersIcon,
  BellIcon,
  PanelLeftClose,
} from "lucide-react";
import { Link } from "react-router";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 z-50 w-86 h-full bg-base-200 transform transition-transform duration-300 ease-in-out shadow-lg ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo + Close */}
      <div className="px-6 py-5 border-b border-base-300 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Glasses className="w-11 h-11 text-primary" />
          <span className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
            Streamify
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 pl-6 pr-4 text-base-content opacity-70 hover:opacity-100 transition-transform hover:scale-110 hover:rotate-[-10deg]"
          aria-label="Close sidebar"
          data-tip="Close Sidebar"
        >
          <PanelLeftClose className="w-7 h-7 text-primary" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-6 py-5 space-y-3 text-lg">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-4 px-5 py-4 rounded-xl text-xl hover:bg-base-100 transition ${
            location.pathname === "/" ? "btn-active bg-base-100" : ""
          }`}
        >
          <HomeIcon className="w-7 h-7 text-base-content opacity-80" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-4 px-5 py-4 rounded-xl text-xl hover:bg-base-100 transition ${
            location.pathname === "/friends" ? "btn-active bg-base-100" : ""
          }`}
        >
          <UsersIcon className="w-7 h-7 text-base-content opacity-80" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-4 px-5 py-4 rounded-xl text-xl hover:bg-base-100 transition ${
            location.pathname === "/notifications"
              ? "btn-active bg-base-100"
              : ""
          }`}
        >
          <BellIcon className="w-7 h-7 text-base-content opacity-80" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* Footer Profile */}
      <div className="px-6 py-5 border-t border-base-300">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">{authUser?.fullName}</p>
            <p className="text-sm text-success flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

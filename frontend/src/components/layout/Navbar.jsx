import React from "react";
import useAuthUser from "../../hooks/useAuthUser";
import { useLocation } from "react-router";
import useLogout from "../../hooks/useLogout";
import { Link } from "react-router";
import { Glasses, BellIcon, LogOutIcon, MenuIcon } from "lucide-react";
import ThemeSelector from "../../components/ThemeSelector";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../../lib/api";
import { SearchBar } from "../ui/SearchBar";

const Navbar = ({ onToggleSidebar }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { error, isPending, logoutMutation } = useLogout();

  const incomingRequests = friendRequests?.incomingRequests.length;

  return (
    <div className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Menu icon for sidebar (mobile only) */}
          <button
            onClick={onToggleSidebar}
            className="btn btn-ghost btn-circle -m-[3rem]"
          >
            <MenuIcon className="h-8 w-8 text-primary" />
          </button>

          {/* Logo (optional, mobile) */}
          <div className="flex items-center gap-2 lg:hidden">
            <Glasses className="size-6 text-primary" />
            <span className="font-bold text-xl text-primary">Streamify</span>
          </div>

          {/* Center Search Control */}
          <SearchBar/>

          {/* Right-side controls */}
          <div className="flex items-center gap-3 sm:gap-4 mr-[2rem]">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle relative">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                {incomingRequests ? (
                  <span className="bg-red-400 rounded-full absolute w-5 h-5 text-center bottom-4 left-5 text-xs leading-5">
                    {incomingRequests}
                  </span>
                ) : null}
              </button>
            </Link>

            <ThemeSelector />

            <Link to={"/profile"}>
              <div className="avatar px-2 pr-4">
                <div className="w-9 rounded-full">
                  <img src={authUser?.profilePic} alt="User Avatar" />
                </div>
              </div>
            </Link>

            <button
              className="btn btn-ghost btn-circle"
              onClick={logoutMutation}
            >
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

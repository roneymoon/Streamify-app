import React from "react";
import useAuthUser from "../../hooks/useAuthUser";

const UserAvatar = () => {
  const { authUser } = useAuthUser();
  return (
    <div>
      {/* User avatar */}
      <div className="avatar">
        <div className="w-10 rounded-full">
          <img src={authUser?.profilePic} alt="User Avatar" />
        </div>
      </div>
    </div>
  );
};

export default UserAvatar;

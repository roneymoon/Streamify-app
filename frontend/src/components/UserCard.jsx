import React from "react";
import { CheckCircleIcon, UserPlusIcon, MapPinIcon } from "lucide-react";
import { getLanguageFlag } from "./FriendCard";
import { capitialize } from "../lib/utils";

const UserCard = ({ user, hasRequestBeenSent, isPending, onSendRequest }) => {
  return (
    <div className="bg-white/10 w-[390px] h-[300px] backdrop-blur-md border border-white/10 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="card-body p-5 space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img src={user.profilePic} alt={user.fullName} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.fullName}</h3>
            {user.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {user.location}
              </div>
            )}
          </div>
        </div>

        {/* Language Flags */}
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-secondary text-xs flex items-center gap-1">
            {getLanguageFlag(user.nativeLanguage)}
            <span>Native: {capitialize(user.nativeLanguage)}</span>
          </span>
          <span className="badge badge-outline text-xs flex items-center gap-1">
            {getLanguageFlag(user.learningLanguage)}
            <span>Learning: {capitialize(user.learningLanguage)}</span>
          </span>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-sm opacity-70 h-[35px] line-clamp-2">
            {user.bio}
          </p>
        )}

        {/* Friend Request Button */}
        <button
          className={`btn w-full mt-2 ${
            hasRequestBeenSent ? "btn-disabled" : "btn-primary"
          }`}
          onClick={() => onSendRequest(user._id)}
          disabled={hasRequestBeenSent || isPending}
        >
          {hasRequestBeenSent ? (
            <>
              <CheckCircleIcon className="size-4 mr-2" />
              Request Sent
            </>
          ) : (
            <>
              <UserPlusIcon className="size-4 mr-2" />
              Send Friend Request
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;

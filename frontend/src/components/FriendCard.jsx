import React from "react";
import { LANGUAGE_TO_FLAG } from "../constants";
import { Link } from "react-router-dom"; // make sure you import this
import { useChatContext } from "../contexts/ChatWidgetContext";

const FriendCard = ({ friend }) => {
  const {openChat} = useChatContext();
  return (
    <div className="card bg-base-200 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
      <div className="card-body p-5">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar">
            <div className="w-14 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
          </div>
          <h3 className="font-semibold text-lg truncate">{friend.fullName}</h3>
        </div>

        {/* LANGUAGE BADGES */}
        <div className="flex flex-wrap gap-2 mb-4 ">
          <span className="badge badge-secondary text-xs px-2 py-1 flex items-center gap-1">
            {getLanguageFlag(friend.nativeLanguage)}
            <span>Nation: {friend.nativeLanguage}</span>
          </span>
          <span className="badge badge-outline text-xs px-2 py-1 flex items-center gap-1">
            {getLanguageFlag(friend.learningLanguage)}
            <span>Learning: {friend.learningLanguage}</span>
          </span>
        </div>

        {/* MESSAGE BUTTON */}
        <Link
          onClick={() => openChat(friend)}
          className="btn btn-outline w-full hover:shadow-sm transition-all duration-150"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

// flag helper
export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 inline-block align-middle"
      />
    );
  }
  return null;
}

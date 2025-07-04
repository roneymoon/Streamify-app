import React, { useEffect, useState } from "react";
import {
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  getRecommendedUsers,
  getUserFriends,
  getOutgoingFriendRequests,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import NoFriendsFound from "../components/NoFriendsFound";
import FriendCard from "../components/FriendCard";
import { getLanguageFlag } from "../components/FriendCard";
import { MapPinIcon } from "lucide-react";
import { capitialize } from "../lib/utils";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Optional modules
import { Navigation, Pagination } from "swiper/modules";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIDs, setOutgoingRequestsIDs] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendRequests,
  });

  const { mutate: sendFriendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data, recipientId) => {
      setOutgoingRequestsIDs((prev) => new Set(prev).add(recipientId));
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIDs(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-200">
      <div className="container mx-auto space-y-10">
        {/* Header and Friend Requests Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length == 0 ? (
          <NoFriendsFound />
        ) : (
          <Swiper
            modules={[Pagination]}
            spaceBetween={10}
            slidesPerView={1.2}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="my-4 !pb-10"
          >
            {friends.map((friend) => (
              <SwiperSlide key={friend._id}>
                <FriendCard friend={friend} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length == 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIDs.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="size-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
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
                          <span>
                            Native: {capitialize(user.nativeLanguage)}
                          </span>
                        </span>
                        <span className="badge badge-outline text-xs flex items-center gap-1">
                          {getLanguageFlag(user.learningLanguage)}
                          <span>
                            Learning: {capitialize(user.learningLanguage)}
                          </span>
                        </span>
                      </div>

                      {/* Bio */}
                      {user.bio && (
                        <p className="text-sm opacity-70 h-[35px]">
                          {user.bio}
                        </p>
                      )}

                      {/* Friend Request Button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendFriendRequestMutation(user._id)}
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
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

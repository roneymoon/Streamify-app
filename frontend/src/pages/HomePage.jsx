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
import UserCard from "../components/UserCard";
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
            <Swiper
              modules={[Pagination]}
              spaceBetween={10}
              slidesPerView={1.2}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 3 },
              }}
              className="my-4 !pb-10"
              
            >
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIDs.has(user._id);
                return (
                  <SwiperSlide key={user._id} className="mr-[2rem]">
                    <UserCard
                      user={user}
                      hasRequestBeenSent={hasRequestBeenSent}
                      isPending={isPending}
                      onSendRequest={sendFriendRequestMutation}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import { completeOnBoarding } from "../lib/api";
import {
  CameraIcon,
  ShuffleIcon,
  MapPinIcon,
  ShipWheelIcon,
  LoaderIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();


  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onBoardingMutation, isPending } = useMutation({
    mutationFn: completeOnBoarding,
    onSuccess: async () => {
      toast.success("Profile On-Boarded Successfully");
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onBoardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random()*100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

    setFormState({...formState, profilePic: randomAvatar})
    toast.success("Random Profile Picture Generated!")
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-2">
      <Toaster/>
      <div className="card bg-base-200 w-full max-w-2xl shadow-md p-5 text-base">
        <div className="card-body p-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PROFILE PIC */}
            <div className="flex flex-col items-center gap-2">
              <div className="size-24 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-8 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent btn-sm text-base"
              >
                <ShuffleIcon className="size-4 mr-1" />
                Generate Random Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full text-base mt-2"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered w-full h-20 text-base mt-2"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full text-base mt-2"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full text-base mt-2"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute z-100 top-7 transform -translate-y-1/2 left-3 size-4 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered pl-8 w-full text-base mt-2"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              className="btn btn-primary w-full text-base mt-2"
              disabled={isPending}
              type="submit"
              onClick={handleSubmit}
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-4 mr-1" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-4 mr-1" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;

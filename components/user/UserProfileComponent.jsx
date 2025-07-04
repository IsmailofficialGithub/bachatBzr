"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import theme from "@/data.js";
import { useDispatch } from "react-redux";
import { fetchAuthSession } from "@/features/auth/authSlice";
import { supabase } from "@/lib/supabaseSetup";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState({
    resetEmailLoading: false,
    updateProfile: false,
  });
  const [message, setMessage] = useState({
    resetEmailMessage: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({
    name: "BachatBzr User",
    email: "xyz@example.com",
    phone: "+92 300 1234567",
    avatar: "https://avatar.iran.liara.run/public/31",
  });
  
  useEffect(() => {
    const fetchSession = async () => {
      const session = await dispatch(fetchAuthSession());
      console.log(session);
      if (session?.payload.user) {
        const user = session.payload.user;
        const name =
          user?.name ||
          user?.user_metadata?.name ||
          user?.user_metadata?.address?.firstName ||
          "BachatBzr user";
        const email = user?.email;
        const phone = user?.phone || user.user_metadata?.address?.phone || "";
        const avatar =
          user?.user_metadata?.avatar ||
          "https://avatar.iran.liara.run/public/31";
        setProfile((prev) => ({ ...prev, name, email, phone, avatar }));
      }
    };
    fetchSession();
  }, []);

  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(profile.avatar);

  // Generate 10 avatar options by changing the number at the end
  const avatarOptions = [
    ...[80, 71, 84, 62, 81].sort(() => 0.5 - Math.random()).slice(0, 5),
    ...[15, 42, 11, 29, 20].sort(() => 0.5 - Math.random()).slice(0, 5),
  ].map((n) => `https://avatar.iran.liara.run/public/${n}`);

  const handleAvatarClick = () => {
    if (isEditing) {
      setShowAvatarOptions(!showAvatarOptions);
    }
  };

  const selectAvatar = (avatarUrl) => {
    setTempAvatar(avatarUrl);
    setShowAvatarOptions(false);
  };

  // Enhanced color palette
  const colorScheme = {
    primary: theme.color.primary || "#d59243", // Warm gold
    secondary: theme.color.secondary || "#f3eee7", // Cream
    accent: "#7a6f5d", // Muted brown
    text: "#333333", // Dark gray
    lightBg: "#f9f7f3", // Light cream
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const updateInfo = async () => {
    setLoading((prev) => ({ ...prev, updateProfile: true }));
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: profile.name,
          avatar: tempAvatar,
          phone: profile.phone?.startsWith("0")
            ? "+92" + profile.phone.slice(1)
            : profile.phone,
        },
      });
      if (error) {
        toast.error("Failed to update profile, please try again.");
        return;
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update your profile, please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, updateProfile: false }));
    }
  };

  const handleSave = () => {
    setProfile((prev) => ({ ...prev, avatar: tempAvatar }));
    updateInfo();
    setIsEditing(false);
    // API call to save profile changes
  };

  const resetpassword = async () => {
    const confirm = prompt("Enter 'Reset' to send reset otp to your email");
    if (confirm !== "Reset") {
      return alert("Reset cancelled");
    }
    setLoading((prev) => ({ ...prev, resetEmailLoading: true }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        profile.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/user/update-password`, // 👈 Must match your frontend route
        },
      );
      if (error) {
        toast.error(error.message || "Failed to send reset password email");
      } else {
        setShowPasswordForm(true);
        setMessage((prev) => ({
          ...prev,
          resetEmailMessage: `Reset Link has been sent to your email ${profile.email} ...`,
        }));
        toast.success(`Reset Link has been sent to your email ...`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading((prev) => ({ ...prev, resetEmailLoading: false }));
      // setShowPasswordForm(false)
    }
  };

  return (
    <div
      className="min-h-screen w-full p-2 sm:p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: colorScheme.lightBg }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Avatar Card */}
          <div className="w-full lg:w-1/3">
            <div
              className="rounded-lg sm:rounded-xl shadow-md overflow-hidden"
              style={{ backgroundColor: colorScheme.secondary }}
            >
              <div className="p-3 sm:p-4 md:p-6 text-center relative">
                <div
                  className="relative mx-auto h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 rounded-full overflow-hidden border-2 sm:border-4 mb-2 sm:mb-4 cursor-pointer"
                  style={{ borderColor: colorScheme.primary }}
                  onClick={handleAvatarClick}
                >
                  <Image
                    src={isEditing ? tempAvatar : profile.avatar}
                    alt="Profile"
                    width={192}
                    height={192}
                    className="object-cover w-full h-full"
                    priority
                  />
                  {isEditing && (
                    <button className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {isEditing && showAvatarOptions && (
                  <div className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg p-3 sm:p-4">
                    <div className="grid grid-cols-5 gap-1 sm:gap-2">
                      {avatarOptions.map((avatar, index) => (
                        <div
                          key={index}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden cursor-pointer hover:ring-2"
                          style={{ borderColor: colorScheme.primary }}
                          onClick={() => selectAvatar(avatar)}
                        >
                          <Image
                            src={avatar}
                            alt={`Avatar option ${index}`}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h2
                  className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 truncate"
                  style={{ color: colorScheme.text }}
                  title={profile.name}
                >
                  {profile.name}
                </h2>
                <p
                  className="text-xs sm:text-sm mb-3 sm:mb-4"
                  style={{ color: colorScheme.accent }}
                >
                  BachatBzr User
                </p>

                <button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className="w-full py-2 px-3 sm:px-4 rounded-md sm:rounded-lg font-medium transition-all bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                  disabled={loading.updateProfile}
                >
                  {isEditing
                    ? loading.updateProfile
                      ? "Updating..."
                      : "Save Profile"
                    : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="w-full lg:w-2/3">
            <div className="rounded-lg sm:rounded-xl shadow-md overflow-hidden bg-white">
              <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6"
                  style={{ color: colorScheme.primary }}
                >
                  Profile Information
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <ProfileField
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    primaryColor={colorScheme.primary}
                  />

                  <ProfileField
                    label="Email Address"
                    name="email"
                    value={profile.email}
                    isEditing={false}
                    type="email"
                    primaryColor={colorScheme.primary}
                  />
                  
                  <ProfileField
                    label="Phone Number"
                    name="phone"
                    value={profile.phone}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="tel"
                    primaryColor={colorScheme.primary}
                  />
                </div>

                {/* Password Section */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <h3
                    className="text-base sm:text-lg font-semibold mb-3 sm:mb-4"
                    style={{ color: colorScheme.primary }}
                  >
                    Security
                  </h3>

                  {showPasswordForm ? (
                    <div
                      className="space-y-4 p-3 sm:p-4 rounded-lg"
                      style={{ backgroundColor: colorScheme.secondary }}
                    >
                      <p className="text-xs sm:text-sm break-words">{message.resetEmailMessage}</p>
                    </div>
                  ) : (
                    <button
                      onClick={resetpassword}
                      className="w-full sm:w-auto py-2 px-3 sm:px-4 rounded-md sm:rounded-lg font-medium border border-[#d59243] text-[#d59243] hover:bg-[#f3eee7] transition-colors text-xs sm:text-sm"
                      disabled={loading.resetEmailLoading}
                    >
                      {loading.resetEmailLoading
                        ? "Sending OTP..."
                        : "Change Password"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Profile Field Component
const ProfileField = ({
  label,
  name,
  value,
  isEditing,
  onChange,
  type = "text",
  primaryColor,
}) => {
  return (
    <div className="w-full">
      <label
        className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2"
        style={{ color: primaryColor }}
      >
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border-b-2 focus:outline-none bg-transparent"
          style={{ borderBottomColor: primaryColor }}
        />
      ) : (
        <p className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-800 break-words">
          {value || "-"}
        </p>
      )}
    </div>
  );
};

export default ProfilePage;
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import theme from "@/data.js";
import { useDispatch } from "react-redux";
import { fetchAuthSession } from "@/features/auth/authSlice";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading,setLoading]=useState({
    resetEmailLoading:false
  })
  const [message,setMessage]=useState({
    resetEmailMessage:""
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({
    name: "Ismail Abbasi",
    email: "xyz@example.com",
    phone: "+92 300 1234567",
    avatar: "https://avatar.iran.liara.run/public/20",
  });
  useEffect(() => {
    const fetchSession = async () => {
      const session = await dispatch(fetchAuthSession());
      if (session?.payload.user) {
        const user = session.payload.user;
        const name =
          user?.name ||
          user?.user_metadata?.name ||
          user?.user_metadata?.address?.firstName ||
          "";
        const email = user.email;
        const phone = user.phone || user.user_metadata?.address.phone || "";
        setProfile((prev) => ({ ...prev, name, email, phone }));
      }
    };
    fetchSession();
  }, []);

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

  const handleSave = () => {
    setIsEditing(false);
    // API call to save profile changes
  };

  const resetpassword=async()=>{
   const confirm= prompt("Enter 'Reset' to send reset otp to your email")
    if(confirm!=="Reset"){
      return alert("Reset cancelled")}
    setLoading((prev)=>({...prev,resetEmailLoading:true}))
    try {
      const {error}=await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/user/update-password`, // 👈 Must match your frontend route
      })
      if(error){
        toast.error(error.message || "Failed to send reset password email")
      }else{
    setShowPasswordForm(true)
        setMessage((prev)=>({...prev,resetEmailMessage:`Reset Link has been sent to your email ${profile.email} ...`}))
        toast.success(`Reset Link has been sent to your email ...`);
      }
      
    } catch (error) {
      console.log(error)
    }finally{
      setLoading((prev)=>({...prev,resetEmailLoading:false}))
      // setShowPasswordForm(false)
    }
  }

  useEffect(() => {console.log(profile)},[profile])

  return (
    <div
      className="min-h-screen w-full p-4 md:p-8"
      style={{ backgroundColor: colorScheme.lightBg }}
    >
      <div className="max-w-6xl mx-auto">
        {" "}
        {/* Wider container for large screens */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Avatar Card (becomes sidebar on large screens) */}
          <div className="w-full lg:w-1/3">
            <div
              className="rounded-xl shadow-md overflow-hidden"
              style={{ backgroundColor: colorScheme.secondary }}
            >
              <div className="p-6 text-center">
                <div
                  className="relative mx-auto h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-4 mb-4"
                  style={{ borderColor: colorScheme.primary }}
                >
                  <Image
                    src={profile.avatar}
                    alt="Profile"
                    width={192}
                    height={192}
                    className="object-cover"
                    priority
                  />
                  {isEditing && (
                    <button className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
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

                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: colorScheme.text }}
                >
                  {profile.name}
                </h2>
                <p
                  className="text-sm mb-4"
                  style={{ color: colorScheme.accent }}
                >
                  BachatBzr User
                </p>

                <button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                    isEditing
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-black`}
                >
                  {isEditing ? "Save Profile" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="w-full lg:w-2/3">
            <div className="rounded-xl shadow-md overflow-hidden bg-white">
              <div className="p-6 md:p-8">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: colorScheme.primary }}
                >
                  Profile Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    isEditing={isEditing}
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
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: colorScheme.primary }}>
                    Security
                  </h3>

                  {showPasswordForm ? (
                    <div
                      className="space-y-4 p-4 rounded-lg"
                      style={{ backgroundColor: colorScheme.secondary }}
                    >
                      <p>{message.resetEmailMessage}</p>
                    </div>
                  ) : (
                    <button
                      onClick={resetpassword}
                      className="py-2 px-4 rounded-lg font-medium border border-[#d59243] text-[#d59243] hover:bg-[#f3eee7] transition-colors"
                    >
                     {loading.resetEmailLoading?"Sending Otp...":"Change Password"}
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
  fullWidth = false,
}) => {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label
        className="block text-sm font-medium mb-1"
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
          className="w-full px-3 py-2 border-b focus:outline-none"
          style={{ borderBottomColor: primaryColor }}
        />
      ) : (
        <p className="px-3 py-2 text-gray-800">{value || "-"}</p>
      )}
    </div>
  );
};



export default ProfilePage;

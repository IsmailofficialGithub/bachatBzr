"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import theme from '@/data';
import { supabase } from "@/lib/supabaseSetup";;
import "@/public/assets/css/tailwind-cdn.css";


const UpdatePassword = () => {
  const { primary, secondary } = theme.color;
  const [accessToken, setAccessToken] = useState(null);

  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);

  // Check token validity on component mount
  useEffect(() => {

    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get("access_token");
      const error = params.get("error_code");
      if(error){
        setTokenError(`Failed to reset password , ${error}`);
        return;
      }
      if(!token){
        setTokenError('Invalid password reset link');
        return;
      }
      setAccessToken(token);
      setTokenValid(true);
    }

    // const verifyToken = async () => {
    //   if (!accessToken) {
    //     setTokenError('Invalid password reset link');
    //     return;
    //   }

    //   try {
    //     const { error } = await supabase.auth.verifyOtp({
    //       token_hash: accessToken,
    //       type: 'recovery'
    //     });

    //     if (error) {
    //       setTokenError(error.message || 'This password reset link has expired or is invalid');
    //     } else {
    //       setTokenValid(true);
    //     }
    //   } catch (err) {
    //     setTokenError('Failed to verify password reset link');
    //   }
    // };

    // verifyToken();
  }, [accessToken, supabase.auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/\d/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) {
        setErrors({ submit: error.message });
      } else {
        setShowSuccess(true);
        setFormData({ newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setErrors({ submit: 'Failed to update password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg text-center" style={{ backgroundColor: secondary }}>
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-red-100">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: primary }}>Invalid Link</h2>
          <p className="text-gray-600 mb-6">{tokenError}</p>
          <a
            href="/forgot-password"
            className="w-full py-3 px-4 rounded-lg font-medium text-white block"
            style={{ backgroundColor: primary }}
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg text-center" style={{ backgroundColor: secondary }}>
          <div className="animate-spin mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ border: `4px solid ${primary}`, borderTopColor: 'transparent' }}></div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: primary }}>Verifying Link</h2>
          <p className="text-gray-600">Please wait while we verify your password reset link...</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg text-center" style={{ backgroundColor: secondary }}>
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-green-100">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: primary }}>Password Updated!</h2>
          <p className="text-gray-600 mb-6">Your password has been successfully changed.</p>
          <a
            href="/user/profile"
            className="w-full py-3 px-4 rounded-lg font-medium text-white block"
            style={{ backgroundColor: primary }}
          >
            Back to Your Account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ backgroundColor: secondary }}>
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${primary}20` }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke={primary}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: primary }}>Set New Password</h2>
          <p className="text-gray-600">Create a new secure password for your account</p>
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2" style={{ color: primary }}>
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ 
                  focusRingColor: primary,
                  backgroundColor: 'rgba(255,255,255,0.8)'
                }}
                placeholder="Enter new password"
              />
              <div className="absolute right-3 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Minimum 8 characters with at least one number</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: primary }}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ 
                  focusRingColor: primary,
                  backgroundColor: 'rgba(255,255,255,0.8)'
                }}
                placeholder="Confirm new password"
              />
              <div className="absolute right-3 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: primary,
                boxShadow: `0 4px 14px ${primary}40`,
                focusRingColor: primary
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
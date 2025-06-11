"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import { useDispatch } from 'react-redux';
import { updateAuthState } from "@/features/auth/authSlice";
export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [message, setMessage] = useState({ text: "", status: "neutral" });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
  

  // Step 1: Initial signup with email and password
  const handleInitialSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", status: "neutral" });

    if (!email || !password) {
      setMessage({
        text: "Please enter both email and password",
        status: "error",
      });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage({
        text: "Make strong password . Password must be 6 letter",
        status: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      // First create the user with email and password
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_API_URL}`,
            data: {
              email_confirmed: false,
              role:'user' // Custom metadata to track verification status
            },
          },
        });

      if (signUpError) {
        toast.error(signUpError.message);
        setMessage({
          text: "Failed to create account. Please try again.",
          status: "error",
        });
        setIsLoading(false);
        return;
      } else {
        setMessage({
          text: `A verification Link has been sent to ${email}. `,
          status: "success",
        });
        setShowOtpField(true)
      }
    } catch (error) {
      toast.error("Something went wrong during authentication");
      setMessage({
        text: "An unexpected error occurred. Please try again later.",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign in with email and password
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", status: "neutral" });

    if (!email || !password) {
      setMessage({
        text: "Please enter both email and password",
        status: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log(error)
      if (error) {
        toast.error(error.message);
        setMessage({ text: `Failed , ${error.message}`, status: "error" });
      } else {
        toast.success("Login successful!");
        dispatch(updateAuthState({ user: data.user, session: data.session }));
        // Check if email is confirmed
        if (data.user.user_metadata?.email_verified === false) {
          // Send a new OTP for verification
          await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: false },
          });
          setMessage({
            text: `Your email is not verified. A new verification code has been sent on your email : ${email}`,
            status: "error",
          });
          setShowOtpField(true);
        } else {
          // Redirect user or update UI state
          router.push('/') // Uncomment to redirect
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong during authentication");
      setMessage({
        text: "An unexpected error occurred. Please try again later.",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Handle Google authentication
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `/`,
        },
      });

      if (error) {
        console.error("Google sign-in error:", error);
        toast.error(error.message);
      }else{

      }
      // The redirect will happen automatically, so no success handling needed here
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to authenticate with Google");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP code
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });

      if (error) {
        console.error("Resend OTP error:", error);
        toast.error(error.message);
      } else {
        setShowOtpField(false)
        toast.success("Verification code resent!");
        setMessage({
          text: "A new verification code has been sent to your email.",
          status: "success",
        });
        setTimeout(() => {
            setShowOtpField(true)
        }, 10000);
      }
    } catch (error) {
      toast.error("Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setShowOtpField(false);
    setMessage({ text: "", status: "neutral" });
  };

  // Check for active session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data?.session) {
        // User is already logged in, redirect or update UI
        router.push(process.env.NEXT_PUBLIC_API_URL)
        setTimeout(() => {
          toast.error("You already login , Please logout to access this page");
        }, 1000);
      }
    };

    checkSession();
  }, []);

  return (
    <>
      <Layout
        headerStyle={3}
        footerStyle={1}
        breadcrumbTitle={isSignUp ? "Sign Up" : "Sign In"}
      >
        <section className="track-area pt-80 pb-40">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 mb-4">
                <div className="toggle-container d-flex justify-content-center align-items-center">
                  <span className={`me-2 ${!isSignUp ? "fw-bold" : ""}`}>
                    Sign In
                  </span>
                  <div className="form-check form-switch d-inline-block">
                    <input
                      style={{ cursor: "pointer" }}
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="formToggle"
                      checked={isSignUp}
                      onChange={toggleForm}
                      disabled={isLoading}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="formToggle"
                    ></label>
                  </div>
                  <span className={`ms-2 ${isSignUp ? "fw-bold" : ""}`}>
                    Sign Up
                  </span>
                </div>
              </div>

              {/* Main authentication container */}
              <div className="col-lg-6 col-sm-12">
                <div className="tptrack__product mb-40">
                  <div className="tptrack__thumb">
                    <img
                      src={
                        isSignUp
                          ? "/assets/img/banner/sign-bg.jpg"
                          : "/assets/img/banner/login-bg.jpg"
                      }
                      alt=""
                    />
                  </div>
                  <div className="tptrack__content grey-bg-3">
                    <div className="tptrack__item d-flex mb-20">
                      <div className="tptrack__item-icon">
                        <img
                          src={
                            isSignUp
                              ? "/assets/img/icon/sign-up.png"
                              : "/assets/img/icon/lock.png"
                          }
                          alt=""
                        />
                      </div>
                      <div className="tptrack__item-content">
                        <h4 className="tptrack__item-title">
                          {isSignUp
                            ?  "Sign Up"
                            : "Login Here"}
                        </h4>
                        <p>
                          Your personal data will be used to support your
                          experience throughout this website, to manage access
                          to your account.
                        </p>
                      </div>
                    </div>

                    {!isSignUp ? (
                      // Sign In Form
                      <form onSubmit={handleSignIn}>
                        <div className="tptrack__id mb-10">
                          <form action="#">
                            <span>
                              <i className="fal fa-user" />
                            </span>
                            <input
                              type="email"
                              placeholder="Email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </form>
                        </div>
                        <div className="tptrack__email mb-10">
                          <form action="#">
                            <span>
                              <i className="fal fa-key" />
                            </span>
                            <input
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </form>
                        </div>                       
                          {message.text && (
                                                        <div className={`alert ${message.status === 'error' ? 'alert-danger' : message.status === 'success' ? 'alert-success' : 'alert-info'} mb-15`}>
                                                            {message.text}
                                                        </div>
                                                    )}

                        <div className="tpsign__remember d-flex align-items-center justify-content-between mb-15">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckDefault"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexCheckDefault"
                            >
                              Remember me
                            </label>
                          </div>
                          <div className="tpsign__pass">
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (email) {
                                  supabase.auth
                                    .resetPasswordForEmail(email)
                                    .then(() =>
                                      toast.success(
                                        "Password reset email sent",
                                      ),
                                    )
                                    .catch(() =>
                                      toast.error("Failed to send reset email"),
                                    );
                                } else {
                                  toast.info("Please enter your email first");
                                }
                              }}
                            >
                              Forgot Password?
                            </Link>
                          </div>
                        </div>

                        <div className="tptrack__btn">
                          <button
                            type="submit"
                            className="tptrack__submition"
                            disabled={isLoading}
                          >
                            {isLoading ? "Signing in..." : "Login Now"}
                            {!isLoading && (
                              <i className="fal fa-long-arrow-right" />
                            )}
                          </button>
                        </div>

                        <div className="social-login mt-15">
                          <p className="text-center mb-10">- OR -</p>
                          <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="google-btn d-flex align-items-center justify-content-center w-100"
                            disabled={isLoading}
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              background: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src="/assets/img/icon/google.webp"
                              alt="Google"
                              style={{ width: "20px", marginRight: "10px" }}
                            />
                            Continue with Google
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Sign Up Form
                      <>
                        
                          
                          <>
                            <div className="tptrack__id mb-10">
                              <form action="#">
                                <span>
                                  <i className="fal fa-envelope" />
                                </span>
                                <input
                                  type="email"
                                  placeholder="Email address"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                />
                              </form>
                            </div>
                            <div className="tptrack__email mb-10">
                              <form action="#">
                                <span>
                                  <i className="fal fa-key" />
                                </span>
                                <input
                                  type="password"
                                  placeholder="Password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                />
                              </form>
                            </div>
                          </>
                       

{message.text && (
                                                        <div className={`alert ${message.status === 'error' ? 'alert-danger' : message.status === 'success' ? 'alert-success' : 'alert-info'} mb-15`}>
                                                            {message.text}
                                                        </div>
                                                    )}

                        {showOtpField && (
                          <div className="tpsign__account mb-15 text-center">
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleResendOTP();
                              }}
                            >
                              Didn't receive a code? Resend
                            </Link>
                          </div>
                        )}

                        <div className="tpsign__account mb-15">
                          <Link
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsSignUp(false);
                            }}
                          >
                            Already Have Account?
                          </Link>
                        </div>

                        <div className="tptrack__btn">
                            <button
                              type="button"
                              className="tptrack__submition tpsign__reg"
                              onClick={handleInitialSignUp}
                              disabled={isLoading}
                            >
                              {isLoading ? "Sending..." : "Register Now"}
                              {!isLoading && (
                                <i className="fal fa-long-arrow-right" />
                              )}
                            </button>
                        </div>

                          <div className="social-login mt-15">
                            <p className="text-center mb-10">- OR -</p>
                            <button
                              type="button"
                              onClick={handleGoogleSignIn}
                              className="google-btn d-flex align-items-center justify-content-center w-100"
                              disabled={isLoading}
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                background: "#fff",
                                cursor: "pointer",
                              }}
                            >
                              <img
                                src="/assets/img/icon/google.webp"
                                alt="Google"
                                style={{ width: "20px", marginRight: "10px" }}
                              />
                              Continue with Google
                            </button>
                          </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

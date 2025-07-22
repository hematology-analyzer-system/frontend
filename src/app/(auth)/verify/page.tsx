// // File: src/app/(auth)/verify-email/page.tsx

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";
// import ForgotPasswordImage from "@/assets/images/ForgotPassword.png";
// import apiIAM from "@/lib/api/apiIAM"; // Ensure apiIAM is imported for API calls

// export default function VerifyEmailPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const emailFromQuery = searchParams.get('email') || ""; // Get email from query parameter

//   const [otp, setOtp] = useState<string[]>(new Array(6).fill("")); // Changed to 6 digits for OTP
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState(""); // For success messages
//   const [resendTimer, setResendTimer] = useState(60); // 60 seconds for resend
//   const [canResend, setCanResend] = useState(false);
//   const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

//   useEffect(() => {
//     // Focus on the first input when the component mounts
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//   }, []);

//   // Timer for resend OTP
//   useEffect(() => {
//     let timerId: NodeJS.Timeout;
//     if (resendTimer > 0) {
//       setCanResend(false); // Disable resend button while timer is running
//       timerId = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//     } else {
//       setCanResend(true); // Enable resend button when timer hits 0
//     }

//     // Cleanup interval on component unmount or when timer resets
//     return () => clearInterval(timerId);
//   }, [resendTimer]);

//   const handleChange = (element: HTMLInputElement, index: number) => {
//     if (isNaN(Number(element.value))) return;

//     const newOtp = [...otp];
//     newOtp[index] = element.value;
//     setOtp(newOtp);

//     // Focus next input
//     if (element.value !== "" && index < otp.length - 1) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace" && otp[index] === "" && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerifyOtp = async (e: React.FormEvent) => { // Renamed from handleSubmit for clarity
//     e.preventDefault();
//     setError("");
//     setSuccessMessage(""); // Clear previous messages

//     const fullOtp = otp.join("");
//     if (fullOtp.length !== otp.length) {
//       setError(`Please enter the complete ${otp.length}-digit OTP.`);
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:8080/iam/auth/verify-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           email: emailFromQuery,
//           otp: fullOtp
//         })
//       });

//       if (res.status === 200) {
//         setSuccessMessage("Email verified successfully! Redirecting to login...");
//         setTimeout(() => {
//           router.push('/login'); // Redirect to login after successful verification
//         }, 2000); // Redirect after 2 seconds
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || "OTP verification failed. Please try again.");
//     }
//   };

//   const handleResendOtp = async () => {
//     setError("");
//     setSuccessMessage("");
//     if (!canResend) return; // Prevent resending if timer is active

//     try {
//       setCanResend(false);
//       setResendTimer(60); // Reset timer to 60 seconds

//       // Send request to backend to resend OTP
//       // const res = await apiIAM.post('/auth/resend-otp', emailFromQuery, {
//       //    headers: {
//       //       'Content-Type': 'text/plain' // Backend expects String as @RequestBody
//       //    }
//       // });

//       const res = await fetch('http://localhost:8080/iam/auth/resend-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'text/plain'
//         },
//         body: emailFromQuery
//       });

      

//       if (res.status === 200) {
//         setSuccessMessage("New OTP sent to your email!");
//         setOtp(new Array(6).fill("")); // Clear OTP input fields for new input
//         inputRefs.current[0]?.focus(); // Focus on first input
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || "Failed to resend OTP. Please try again.");
//     }
//   };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4 font-sans">
//       <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
//         {/* Left Side - Image and Marketing Text */}
//         <div className="md:w-1/2 bg-gradient-to-br from-teal-500 to-blue-800 text-white flex flex-col items-center justify-center p-10 py-12">
//           <h2 className="text-3xl font-bold mb-4 text-center">Verify your email</h2>
//           <Image src={ForgotPasswordImage} alt="Verify Email" width={300} height={300} className="mb-4 drop-shadow-lg" />
//           <p className="text-center text-sm max-w-sm mb-6 leading-relaxed opacity-90">
//             A 6-digit verification code has been sent to your email address: <strong>{emailFromQuery || 'your email'}</strong>. Please enter it below.
//           </p>
//         </div>

//         {/* Right Side - OTP Verification Form */}
//         <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
//           <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Verify your email</h2>
//           <p className="text-gray-600 text-center mb-8 text-sm">Enter the OTP sent to your email</p>
//           <form onSubmit={handleVerifyOtp} className="w-full max-w-md"> {/* Updated onSubmit handler */}
//             <div className="flex justify-center gap-4 mb-6">
//               {otp.map((data, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength={1}
//                   value={data}
//                   onChange={(e) => handleChange(e.target, index)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                   ref={(el) => {
//                     inputRefs.current[index] = el;
//                   }}
//                   className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-yellow-50/50 border-yellow-200"
//                 />
//               ))}
//             </div>
//             {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
//             {successMessage && <p className="text-green-500 text-xs mt-1 text-center">{successMessage}</p>} {/* Display success message */}

//             <button
//               type="submit"
//               className="w-full py-3 mt-4 rounded-full text-white font-semibold bg-blue-800 hover:bg-blue-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
//             >
//               Verify OTP {/* Changed button text */}
//             </button>

//             {/* Resend OTP button with timer */}
//             <div className="text-center mt-4">
//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 disabled={!canResend}
//                 className={`text-sm font-medium ${
//                   canResend ? "text-blue-600 hover:underline" : "text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 Resend OTP {resendTimer > 0 && `(${resendTimer}s)`}
//               </button>
//             </div>

//             <a href="/login" className="text-sm text-gray-500 mt-6 hover:underline block text-center">
//               Back to sign in
//             </a>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


// File: src/app/(auth)/verify-otp/page.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import ForgotPasswordImage from "@/assets/images/ForgotPassword.png"; // Reusing the image
import apiIAM from "@/lib/api/apiIAM";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || ""; // Get email from query parameter
  const flowType = searchParams.get('flow'); // 'forgotPassword' or 'register'

  const [otp, setOtp] = useState<string[]>(new Array(6).fill("")); // 6 digits for OTP
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds for resend
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // Focus on the first input when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    // If no email is provided in query, redirect back
    if (!emailFromQuery) {
      router.push('/login'); // Or a more appropriate error page
    }
  }, [emailFromQuery, router]);

  // Timer for resend OTP
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (resendTimer > 0) {
      setCanResend(false);
      timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(timerId);
  }, [resendTimer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const fullOtp = otp.join("");
    if (fullOtp.length !== otp.length) {
      setError(`Please enter the complete ${otp.length}-digit OTP.`);
      return;
    }

    setIsLoading(true);
    try {
      let endpoint = '';
      let redirectPath = '';

      if (flowType === 'forgotPassword') {
        endpoint = '/auth/verify-reset-otp'; // Backend endpoint for forgot password OTP verification
        redirectPath = `/reset-password?email=${encodeURIComponent(emailFromQuery)}`;
      } else { // Default to registration flow if flowType is not specified or is 'register'
        endpoint = '/auth/verify-otp'; // Backend endpoint for registration OTP verification
        redirectPath = '/login';
      }

        const res = await fetch(`http://localhost:8080/iam${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailFromQuery,
            otp: fullOtp,
          }),
        });

        
        if (res.status === 200) {
        const data = await res.json();
        setSuccessMessage(data.message || "OTP verified successfully! Redirecting...");
        setTimeout(() => {
          router.push(redirectPath);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");
    if (!canResend) return;

    setIsLoading(true);
    try {
      setCanResend(false);
      setResendTimer(60); // Reset timer

      let endpoint = '';
      if (flowType === 'forgotPassword') {
        endpoint = '/auth/forgot-password'; // Re-use forgot-password endpoint to resend OTP
      } else {
        endpoint = '/auth/resend-otp'; // Endpoint for registration OTP resend
      }

      // const res = await apiIAM.post(endpoint, emailFromQuery, {
      //    headers: {
      //       'Content-Type': 'text/plain'
      //    }
      // });

      console.log(endpoint);

      const res = await fetch(`http://localhost:8080/iam${endpoint}`, {
        method: 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body: emailFromQuery,
        credentials: "omit"
      })

      if (res.status === 200) {
        const data = await res.json();
        setSuccessMessage(data.message || "New OTP sent to your email!");
        setOtp(new Array(6).fill("")); // Clear OTP input fields
        inputRefs.current[0]?.focus(); // Focus on first input
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Image and Marketing Text */}
        <div className="md:w-1/2 bg-gradient-to-br from-teal-500 to-blue-800 text-white flex flex-col items-center justify-center p-10 py-12">
          <h2 className="text-3xl font-bold mb-4 text-center">Verify your email</h2>
          <Image src={ForgotPasswordImage} alt="Verify Email" width={300} height={300} className="mb-4 drop-shadow-lg" />
          <p className="text-center text-sm max-w-sm mb-6 leading-relaxed opacity-90">
            A 6-digit verification code has been sent to your email address: <strong>{emailFromQuery}</strong>. Please enter it below.
          </p>
        </div>

        {/* Right Side - OTP Verification Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Verify your email</h2>
          <p className="text-gray-600 text-center mb-8 text-sm">Enter the OTP sent to your email</p>
          <form onSubmit={handleVerifyOtp} className="w-full max-w-md">
            <div className="flex justify-center gap-4 mb-6">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-yellow-50/50 border-yellow-200"
                  disabled={isLoading} // Disable inputs during loading
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-xs mt-1 text-center">{successMessage}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 rounded-full text-white font-semibold bg-blue-800 hover:bg-blue-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isLoading}
                className={`text-sm font-medium ${
                  canResend && !isLoading ? "text-blue-600 hover:underline" : "text-gray-400 cursor-not-allowed"
                }`}
              >
                Resend OTP {resendTimer > 0 && `(${resendTimer}s)`}
              </button>
            </div>

            <a href="/login" className="text-sm text-gray-500 mt-6 hover:underline block text-center">
              Back to sign in
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
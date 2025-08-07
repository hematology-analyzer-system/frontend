"use client";

import Image from "next/image";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";
import ForgotPassWord from "@/assets/images/ForgotPassword.png"
import { useRouter } from "next/navigation";
import BackTo from "../../components/BackTo";

function ForgotPassword() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark transition-all p-5 lg:p-0">
            <div
                className={`relative grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[5fr 1fr] justify-items-center items-center h-auto min-h-[400px] bg-surface dark:bg-surface-dark rounded-2xl shadow-xl w-full max-w-[1000px] overflow-hidden`}
            >
                {/* Left deco */}
                <div className="relative hidden lg:block lg:col-start-1 lg:row-span-2 lg:visible w-full max-w-[600px] drop-shadow-md hover:transform-3d hover:scale-101 transition-all duration-500 ease-out hover:drop-shadow-surface-dark">
                    {/* Circle background */}
                    <div className="absolute z-0 w-[120%] left-1/2 top-1/2 -translate-x-2/3 -translate-y-1/2 aspect-square rounded-full bg-linear-90 from-primary-darker to-primary" />
                    <Image src={ForgotPassWord} alt={"Female Doctor"} className="relative z-1 w-9/10 h-auto" />
                </div>

                {/* Form forgot password */}
                <div className="lg:col-start-2">
                    <ForgotPasswordForm />
                </div>

                <div onClick={() => router.replace("/")} className="max-h-1/2 mb-10 md:mb-0 -mt-10 select-none">
                    <BackTo address="choose role" width="18" />
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
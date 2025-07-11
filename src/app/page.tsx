"use client";

<script src="https://accounts.google.com/gsi/client" async defer></script>

import Image from "next/image";
import { useRouter } from "next/navigation";
import machineImage from "@/assets/images/DxH900.png";
import roundBackground from "@/assets/images/Round-Background.png";
import { motion } from "framer-motion";

export default function ChooseRole() {
    const router = useRouter();

    const handleNavigate = (role: string) => {
        switch (role) {
            case "guess":
                router.push("/guess");
                break;
            case "user":
                router.push("/user");
                break;
            case "admin":
                router.push("/admin");
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-text-primary dark:bg-background-dark dark:text-text-primary-dark px-4">
            <div className="relative flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-4 gap-10 max-w-7xl w-full items-center">
                {/* Tiêu đề */}
                <h1 className="text-primary dark:text-primary-dark relative lg:col-span-3 text-3xl lg:text-4xl font-bold color-primary-darker text-center justify-self-center my-10">
                    Welcome to Hematology Analyzer Website!
                </h1>

                {/* Hình máy */}
                <motion.div
                    initial={{ opacity: 0, x: 0, scale: 0.5 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative lg:col-span-2 lg:row-span-3 lg:col-start-1 flex aspect-auto"
                >
                    <div className="absolute left-[-5px] bottom-[-20px] rounded-full aspect-square w-3/4 max-w-md h-auto bg-linear-[-45deg] from-primary-darker to-primary z-0  hover:scale-103 transition-all duration-500 ease-in-out"></div>
                    <Image
                        src={roundBackground}
                        alt="rounded-linear"
                        className="absolute left-30 bottom-0 z-2 max-w-md w-2/3 animate-pulse hover:scale-103 transition-all duration-500 ease-in-out"
                    />
                    <Image
                        src={machineImage}
                        alt="DxH900 Machine"
                        className="relative z-10 max-w-xl w-full object-contain hover:scale-103 transition-all duration-500 ease-in-out"
                        priority
                    />
                </motion.div>

                {/* Lựa chọn vai trò */}
                <div className="lg:col-span-1 lg:row-span-3 flex flex-col items-center text-center gap-6">
                    <p className="text-primary dark:text-primary-dark font-bold text-2xl">Choose a role for the next steps</p>

                    <div className="flex flex-col gap-8 w-full max-w-[270px]">
                        <motion.button
                            whileHover={{ scale: 0.95 }}
                            transition={{ duration: 0, ease: "easeInOut" }}
                            className="button py-8 drop-shadow-md drop-shadow-gray-600 text-2xl" onClick={() => handleNavigate("guess")}>
                            Guest
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 0.95 }}
                            transition={{ duration: 0, ease: "easeInOut" }}
                            className="button py-8 drop-shadow-md drop-shadow-gray-600 text-2xl" onClick={() => handleNavigate("user")}>
                            User
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 0.95 }}
                            transition={{ duration: 0, ease: "easeInOut" }}
                            className="button py-8 drop-shadow-md drop-shadow-gray-600 text-2xl" onClick={() => handleNavigate("admin")}>
                            Administrator
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}

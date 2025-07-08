import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { motion } from "framer-motion";

export default function UserAuthPage() {
    const [isSignIn, setIsSignIn] = useState(true);

    const handleToggle = () => setIsSignIn((prev) => !prev);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark transition-colors p-5 lg:p-0">
            <div
                className={`relative grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center h-auto min-h-[450px] bg-surface dark:bg-surface-dark rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden`}
            >
                {/* Decorator (trái nếu Sign Up, phải nếu Sign In) */}
                <motion.div
                    key={isSignIn ? "decor-signin" : "decor-signup"}
                    initial={{ opacity: 0, x: isSignIn ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isSignIn ? -50 : 50 }}
                    transition={{ duration: 0.5 }}
                    className={`relative flex flex-col justify-self-stretch bg-linear-[-20deg] from-primary-darker from-0% to-primary to-50% text-center w-full p-[15%] gap-10 justify-center
                    ${isSignIn
                            ? "order-2 rounded-t-[100px] lg:rounded-tl-[250px] lg:rounded-tr-none lg:rounded-t-none lg:text-right"
                            : "order-1 rounded-b-[100px] lg:rounded-tr-[250px] lg:rounded-tl-none lg:rounded-b-none lg:text-left"
                        }`}
                >
                    <h1 className="title text-text-primary-dark text-4xl">
                        {isSignIn ? "Hello user!" : "Welcome back!"}
                    </h1>
                    <p className="text-md text-text-primary-dark">
                        {isSignIn
                            ? "Don't have an account? Sign up to get full access."
                            : "Already have an account? Sign in to continue."}
                    </p>

                    <button
                        onClick={handleToggle}
                        className="outline-button border-text-primary-dark text-text-primary-dark hover:bg-text-secondary-dark max-w-[400px]"
                    >
                        {isSignIn ? "Sign up" : "Sign in"}
                    </button>
                </motion.div>

                {/* Form (phía còn lại) */}
                <motion.div
                    key={isSignIn ? "form-signin" : "form-signup"}
                    initial={{ opacity: 0, x: isSignIn ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isSignIn ? 50 : -50 }}
                    transition={{ duration: 0.5 }}
                    className={`relative w-full max-w-md py-10 px-5 lg:px-15 ${isSignIn ? "order-1" : "order-2" }`}
                >
                    <AuthForm formName={isSignIn ? "Sign In" : "Sign Up"} isAdmin={false}/>
                </motion.div>
            </div>
        </div>
    );
}

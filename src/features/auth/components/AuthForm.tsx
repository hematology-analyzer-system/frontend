import { useState } from "react";
import CheckboxToggle from "./CheckBoxToggle";
import PasswordInput from "./PasswordInput";
import GoogleIcon from "@/assets/icons/Google";

interface PropsType {
    formName: string;
    isAdmin: boolean;
}

export default function AuthForm({ formName, isAdmin }: PropsType) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex flex-col w-full gap-3">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-6 text-primary dark:text-primary-dark">
                {formName}
            </h1>

            {/* Input Area */}
            <form className="flex flex-col gap-3" action="/user">
                <label>
                    <input
                        className="input"
                        placeholder="Enter your user name"
                        name="userName"
                        onChange={(e) => setUserName(e.target.value)}
                        autoComplete="on"
                        required
                    />
                </label>

                <label>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        name="password"
                    />
                </label>

                {/* (Optional) Remember me? */}
                <div className={`flex flex-row ${!isAdmin ? "justify-between" : "justify-end"} px-1 mb-5`}>
                    {/* Remember me */}
                    <CheckboxToggle label="Remember me?" />

                    {/* Forgot password */}
                    {!isAdmin && <p className="cursor-pointer text-sm text-text-secondary dark:text-text-secondary-dark select-none hover:underline hover:text-primary transition-all">Forgot password?</p>}
                </div>

                {/* Buttons Area */}
                <button className="button" type="submit">Sign in</button>
                <button className="outline-button flex flex-row gap-2 items-center justify-center" type="submit">
                    <GoogleIcon />
                    Sign in with Google
                </button>
            </form>
        </div>
    );
};
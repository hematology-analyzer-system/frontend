import { useState } from "react";
import CheckboxToggle from "./CheckBoxToggle";
import PasswordInput from "./PasswordInput";
import GoogleIcon from "@/assets/icons/Google";
import Line from "@/components/Line";
import BackTo from "./BackTo";
import { useRouter } from "next/navigation";


interface PropsType {
    formName: string;
    isAdmin: boolean;
}


const HandleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
}

export default function AuthForm({ formName, isAdmin }: PropsType) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    return (
        <div className="flex flex-col w-full">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-6 text-primary dark:text-primary-dark">
                {formName}
            </h1>

            {/* Input Area */}
            <form className="flex flex-col gap-3" onSubmit={HandleSubmit}>
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
                <div className={`flex flex-row ${!isAdmin ? "justify-between" : "justify-end"} px-1 mb-2`}>
                    {/* Remember me */}
                    <CheckboxToggle label="Remember me?" />

                    {/* Forgot password */}
                    {!isAdmin && <p className="cursor-pointer text-sm text-text-secondary dark:text-text-secondary-dark select-none hover:underline hover:text-primary transition-all" onClick={()=>router.replace("/forgot-password")}>
                        Forgot password?
                    </p>}
                </div>

                {/* Buttons Area */}
                <button className="button" type="submit">{formName}</button>

                <div className="relative flex flex-row justify-between mt-5 w-full">
                    <Line width={"30%"} />
                    <p className="text-text-muted text-sm">Or {formName.toLowerCase()} with</p>
                    <Line width={"30%"} />
                </div>
                <button className="outline-button flex flex-row gap-2 items-center justify-center select-none" type="submit">
                    <GoogleIcon />
                    {formName} with Google
                </button>
            </form>

            <div className="select-none mx-auto mt-5" onClick={() => router.replace("/")}>
                <BackTo address={"choose role"} width="16" />
            </div>
        </div>
    );
};
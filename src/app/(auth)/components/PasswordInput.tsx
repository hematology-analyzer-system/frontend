import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
}

export default function PasswordInput({ value, onChange, placeholder, name }: PasswordInputProps) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Enter your password"}
                name={name || "default name"}
                className="input"
                required
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-primary dark:text-gray-300 cursor-pointer"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}

import { useState } from "react";

interface CheckboxToggleProps {
    label: string;
    onChange?: (checked: boolean) => void;
}

export default function CheckboxToggle({ label, onChange }: CheckboxToggleProps) {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);
        onChange?.(!checked);
    };

    return (
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-text-secondary dark:text-text-secondary-dark">
            <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                className="accent-primary w-4 h-4 cursor-pointer"
            />
            {label}
        </label>
    );
}

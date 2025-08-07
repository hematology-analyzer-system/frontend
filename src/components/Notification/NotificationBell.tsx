import { useEffect, useState } from "react";
import NotificationDropDown from "./NotificationDropDown";
import { useNotification } from "@/hooks/useNotification";
import NotificationIcon from "@/assets/icons/NotificationIcon";
import NotificationOutlineIcon from "@/assets/icons/NotificationOutlineIcon";


export default function NotificationBell() {
    const { unreadCount } = useNotification();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className="cursor-pointer">
                {open ? <NotificationIcon /> : <NotificationOutlineIcon />}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {open && <NotificationDropDown />}
        </div>
    );
}

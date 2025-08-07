import { BellIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export default function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6 text-black" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b font-semibold">Notifications</div>
          <ul className="divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <li className="p-4 text-gray-500 text-sm">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li key={n.id} className="p-4 text-sm">
                  <div className="font-medium">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.timestamp}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

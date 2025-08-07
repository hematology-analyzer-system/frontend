import { useNotification } from "@/hooks/useNotification";
import { NotificationEvent } from "@/type/NotificationEvent";
import { useRouter } from "next/navigation";

interface Props {
    notificationItem: NotificationEvent;
}

export default function NotificationItem({ notificationItem }: Props) {
    let{ markAsRead, setOpen } = useNotification();

    const router = useRouter();

    const calculateMinite = (createdAt: Date) => {
        const created = new Date(createdAt);
        const now = new Date();

        const minuteInterval = Math.floor((now.getTime() - created.getTime()) / 60000);

        if (minuteInterval < 1) {
            return "Just now";
        } else if (minuteInterval === 1) {
            return "1 minute ago";
        } else if (minuteInterval < 60) {
            return `${minuteInterval} minutes ago`;
        } else if (minuteInterval == 60) {
            return "1 hour ago";
        } else if (minuteInterval / 60 < 24) {
            return `${Math.floor(minuteInterval / 60)} hours ago`;
        }
        return created.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleOnClick = () => {
        setOpen(false);
        markAsRead(notificationItem.id);
        
        // Determine redirect path based on entity type
        if (notificationItem.entityType === "USER") {
            // Redirect to user details page for IAM notifications
            router.replace(`/iam/users/${notificationItem.entityId}`);
        } else if (notificationItem.entityType === "PATIENT" || notificationItem.entityType === "PATIENT_ORDER") {
            // Redirect to patient details page for patient notifications
            router.replace(`/patients/${notificationItem.entityId}`);
        } else {
            // Default behavior for unknown entity types
            console.warn(`Unknown entity type: ${notificationItem.entityType}`);
            // You could add a fallback behavior here if needed
        }
    };

    return (
        <li
            className={`relative px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer 
            ${notificationItem.isRead ? "bg-white" : "bg-gray-100 font-semibold"}`}
            onClick={handleOnClick}>

            {!notificationItem.isRead && <div className="w-[10px] h-[10px] rounded-full bg-primary absolute right-3"></div>}

            <div className="text-normal font-semibold">{notificationItem.title}</div>
            <div className="text-normal line-clamp-3">{notificationItem.message}</div>
            <div className={`text-small ${!notificationItem.isRead ? "text-primary" : "text-text-secondary"}`}>
                {calculateMinite(notificationItem.createdAt)}</div>
        </li>
    );
}
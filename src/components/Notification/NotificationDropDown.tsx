import { useNotification } from "@/hooks/useNotification";
import NotificationItem from "./NotificationItem";

export default function NotificationDropDown() {
    const { notifications, markAllAsRead, loadNextPage, hasMore, loading } = useNotification();

    console.log(`NotificationDropDown render - displayed notifications: ${notifications.length}, hasMore: ${hasMore}, loading: ${loading}`);

    return (
        <div className="absolute right-0 px-3 py-5 w-100 bg-white shadow-2xl rounded-xl z-50 h-auto max-h-[85vh] overflow-y-auto flex flex-col gap-y-2 transition-all">
            <div className="relative flex justify-between items-center mb-3">
                <span className="text-subTitle font-bold ml-2">Notification</span>
                <button onClick={markAllAsRead} className="text-sm text-primary cursor-pointer hover:bg-[#d8d8d84e] px-2 py-2 rounded-lg">
                    Mark all as read
                </button>
            </div>

            <ul className="relative flex flex-col gap-y-2 transition-all">
                {notifications.length === 0 ?
                    <div className="text-normal text-center">You have no notifications</div>
                    :
                    notifications.map((n) => (
                        <NotificationItem key={n.id} notificationItem={n} />
                    ))}
            </ul>

            {loading && <div className="text-normal text-center">Loading ...</div>}

            {hasMore &&
                <button className="relative button py-2 rounded-lg text-normal text-text-primary-dark font-semibold"
                    onClick={() => loadNextPage()}>
                    See more previous notifications
                </button>}
        </div>
    );
}
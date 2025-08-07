// hooks/useNotification.ts
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { NotificationEvent } from "@/type/NotificationEvent";


export function useNotification() {
    const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const stompClient = useRef<Client | null>(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(false);


    // const fetchNotifications = async () => {
    //     try {
    //         const res = await fetch("http://localhost:8081/patient/notifications", {
    //             credentials: "include",
    //         });
    //         const data = await res.json();
    //         setNotifications(data);
    //     } catch (err: any) {
    //         console.log("Error in fetching notification list");
    //         throw err;
    //     }
    // };

    const fetchPageNotifications = async (pageNumber: number) => {
        try {
            setLoading(true);

            const res = await fetch(`http://localhost:8081/patient/notifications/paging?page=${pageNumber}&size=4`, {
                credentials: "include"
            });
            const data = await res.json();

            if (data.content.length === 0 || data.last) {
                setHasMore(false);
                return;
            }

            setNotifications((prev) => {
                const combined = [...prev, ...data.content];
                // Remove duplicates by id
                const unique = combined.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );
                return unique;
            });
        } catch (err: any) {
            console.log("Error in fetch Notification events with paging");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loadNextPage = () => {
        if (hasMore) {
            setPage((prev) => prev + 1);
            fetchPageNotifications(page);
        }
    }

    const fetchUnreadCount = async () => {
        try {
            const res = await fetch("http://localhost:8081/patient/notifications/unread-count", {
                credentials: "include",
            });
            const data = await res.json();
            setUnreadCount(data);
        } catch (err: any) {
            console.log("Error in fetching Unread-count");
            throw err;
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`http://localhost:8081/patient/notifications/${id}/read`, {
                method: "PUT",
                credentials: "include",
            });
            fetchPageNotifications(page);
            fetchUnreadCount();
        } catch (err: any) {
            console.log("Error in mark an event read")
            throw err;
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`http://localhost:8081/patient/notifications/mark-all-read`, {
                method: "PUT",
                credentials: "include",
            });
            fetchPageNotifications(page);
            fetchUnreadCount();
        } catch (err: any) {
            console.log("Error in mark all as read");
            throw err;
        }
    };

    useEffect(() => {
        fetchPageNotifications(0);
        fetchUnreadCount();

        const socket = new SockJS("http://localhost:8081/patient/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe("/topic/notification", (message) => {
                    const newNotification: NotificationEvent = JSON.parse(message.body);
                    setNotifications((prev) => [newNotification, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    fetchUnreadCount();
                });
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            stompClient.current?.deactivate();
        };
    }, []);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        loadNextPage,
        hasMore,
        loading,
    };
}

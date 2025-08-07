// hooks/useNotification.ts
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { NotificationEvent } from "@/type/NotificationEvent";


export function useNotification() {
    const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
    const [inMemoryNotifications, setInMemoryNotifications] = useState<NotificationEvent[]>([]); // For IAM notifications
    const [unreadCount, setUnreadCount] = useState(0);
    const stompClient = useRef<Client | null>(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    // Load IAM notifications from localStorage on mount
    useEffect(() => {
        const savedIamNotifications = localStorage.getItem('iam-notifications');
        if (savedIamNotifications) {
            try {
                const parsed: NotificationEvent[] = JSON.parse(savedIamNotifications);
                // Convert date strings back to Date objects
                const withDates = parsed.map(n => ({
                    ...n,
                    createdAt: new Date(n.createdAt),
                    targetPrivileges: new Set(n.targetPrivileges || [])
                }));
                setInMemoryNotifications(withDates);
            } catch (e) {
                console.error('Error loading IAM notifications from localStorage:', e);
                localStorage.removeItem('iam-notifications'); // Clean up corrupted data
            }
        }
    }, []);

    // Save IAM notifications to localStorage whenever they change
    useEffect(() => {
        if (inMemoryNotifications.length > 0) {
            try {
                // Convert Set to Array for JSON serialization
                const serializable = inMemoryNotifications.map(n => ({
                    ...n,
                    targetPrivileges: Array.from(n.targetPrivileges || [])
                }));
                localStorage.setItem('iam-notifications', JSON.stringify(serializable));
            } catch (e) {
                console.error('Error saving IAM notifications to localStorage:', e);
            }
        }
    }, [inMemoryNotifications]);

    // Helper function to add new IAM notification and save to localStorage
    const addIamNotification = (newNotification: NotificationEvent) => {
        setInMemoryNotifications(prev => {
            const updated = [newNotification, ...prev];
            // Save to localStorage
            try {
                const serializable = updated.map(n => ({
                    ...n,
                    targetPrivileges: Array.from(n.targetPrivileges || [])
                }));
                localStorage.setItem('iam-notifications', JSON.stringify(serializable));
            } catch (e) {
                console.error('Error saving new IAM notification to localStorage:', e);
            }
            return updated;
        });
        
        // Update the combined notifications display
        setNotifications(prev => [newNotification, ...prev]);
        
        // Recalculate unread count after localStorage is updated
        setTimeout(() => {
            calculateUnreadCount();
        }, 50);
    };


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

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();

            if (data.content.length === 0 || data.last) {
                setHasMore(false);
                return;
            }

            const newPatientNotifications = data.content;
            
            // Update patient notifications without affecting in-memory IAM notifications
            setNotifications((prev) => {
                // Get only patient notifications (filter out IAM notifications)
                const existingPatientNotifications = prev.filter(n => 
                    n.entityType === "PATIENT" || n.entityType === "PATIENT_ORDER"
                );
                
                const combined = [...existingPatientNotifications, ...newPatientNotifications];
                // Remove duplicates by id
                const unique = combined.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );
                
                // Merge with in-memory IAM notifications, putting IAM notifications first (newest)
                return [...inMemoryNotifications, ...unique];
            });
        } catch (err: any) {
            console.warn("Patient service unavailable, showing only IAM notifications:", err);
            // If patient service is down, just show IAM notifications
            setNotifications(prev => {
                // Filter out any patient notifications and keep only IAM
                const iamOnly = prev.filter(n => n.entityType === "USER");
                return [...inMemoryNotifications];
            });
            setHasMore(false);
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

    // Helper function to calculate total unread count
    const calculateUnreadCount = async () => {
        try {
            // Get patient unread count from API
            let patientUnreadCount = 0;
            try {
                const res = await fetch("http://localhost:8081/patient/notifications/unread-count", {
                    credentials: "include",
                });
                patientUnreadCount = await res.json();
            } catch (patientServiceError) {
                console.warn("Patient service unavailable, only counting IAM notifications:", patientServiceError);
            }
            
            // Get IAM unread count from localStorage
            let iamUnreadCount = 0;
            try {
                const savedIamNotifications = localStorage.getItem('iam-notifications');
                if (savedIamNotifications) {
                    const parsed: NotificationEvent[] = JSON.parse(savedIamNotifications);
                    iamUnreadCount = parsed.filter(n => !n.isRead).length;
                }
            } catch (e) {
                console.error('Error reading IAM notifications for unread count:', e);
            }
            
            const totalUnread = patientUnreadCount + iamUnreadCount;
            setUnreadCount(totalUnread);
            return totalUnread;
        } catch (err: any) {
            console.log("Error in calculating unread count");
            throw err;
        }
    };

    const fetchUnreadCount = async () => {
        return calculateUnreadCount();
    };

    const markAsRead = async (id: string) => {
        try {
            // Check if it's an IAM notification (in-memory)
            const isIamNotification = inMemoryNotifications.some(n => n.id === id);
            
            if (isIamNotification) {
                // Mark IAM notification as read in memory
                setInMemoryNotifications(prev => {
                    const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
                    // Also update localStorage immediately
                    try {
                        const serializable = updated.map(n => ({
                            ...n,
                            targetPrivileges: Array.from(n.targetPrivileges || [])
                        }));
                        localStorage.setItem('iam-notifications', JSON.stringify(serializable));
                    } catch (e) {
                        console.error('Error updating IAM notifications in localStorage:', e);
                    }
                    return updated;
                });
                
                // Update the combined notifications
                setNotifications(prev => 
                    prev.map(n => n.id === id ? { ...n, isRead: true } : n)
                );
                
                // Recalculate unread count after localStorage is updated
                setTimeout(() => {
                    calculateUnreadCount();
                }, 50);
            } else {
                // Handle patient notifications via API
                try {
                    await fetch(`http://localhost:8081/patient/notifications/${id}/read`, {
                        method: "PUT",
                        credentials: "include",
                    });
                    fetchPageNotifications(page);
                    calculateUnreadCount();
                } catch (patientServiceError) {
                    console.warn("Patient service unavailable, could not mark patient notification as read:", patientServiceError);
                    // Still try to update the display optimistically
                    setNotifications(prev => 
                        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
                    );
                }
            }
        } catch (err: any) {
            console.log("Error in mark an event read")
            throw err;
        }
    };

    const markAllAsRead = async () => {
        try {
            // Try to mark all patient notifications as read via API
            try {
                await fetch(`http://localhost:8081/patient/notifications/mark-all-read`, {
                    method: "PUT",
                    credentials: "include",
                });
            } catch (patientServiceError) {
                console.warn("Patient service unavailable, only marking IAM notifications as read:", patientServiceError);
            }
            
            // Mark all IAM notifications as read in memory
            setInMemoryNotifications(prev => {
                const updated = prev.map(n => ({ ...n, isRead: true }));
                // Also update localStorage immediately
                try {
                    const serializable = updated.map(n => ({
                        ...n,
                        targetPrivileges: Array.from(n.targetPrivileges || [])
                    }));
                    localStorage.setItem('iam-notifications', JSON.stringify(serializable));
                } catch (e) {
                    console.error('Error updating IAM notifications in localStorage:', e);
                }
                return updated;
            });
            
            // Update the combined notifications
            setNotifications(prev => 
                prev.map(n => ({ ...n, isRead: true }))
            );
            
            // Try to fetch page notifications, but don't fail if patient service is down
            try {
                fetchPageNotifications(page);
            } catch (fetchError) {
                console.warn("Could not fetch patient notifications:", fetchError);
            }
            
            // Recalculate unread count after localStorage is updated
            setTimeout(() => {
                calculateUnreadCount();
            }, 50);
        } catch (err: any) {
            console.log("Error in mark all as read");
            throw err;
        }
    };

    useEffect(() => {
        fetchPageNotifications(0);
        fetchUnreadCount();

        // Patient service WebSocket connection
        const patientSocket = new SockJS("http://localhost:8081/patient/ws");
        const patientClient = new Client({
            webSocketFactory: () => patientSocket,
            onConnect: () => {
                console.log("Connected to patient service WebSocket");
                patientClient.subscribe("/topic/notification", (message) => {
                    const newNotification: NotificationEvent = JSON.parse(message.body);
                    setNotifications((prev) => [newNotification, ...prev]);
                    fetchUnreadCount(); // Refresh unread count from server
                });
            },
            onStompError: (frame) => {
                console.warn("Patient service WebSocket error:", frame);
            },
            onWebSocketError: (event) => {
                console.warn("Patient service WebSocket connection error:", event);
            },
        });

        // IAM service WebSocket connection for user management notifications
        const iamSocket = new SockJS("http://localhost:8080/iam/ws");
        const iamClient = new Client({
            webSocketFactory: () => iamSocket,
            onConnect: () => {
                // User locked notifications
                iamClient.subscribe("/topic/userLocked", (message) => {
                    if (message.body) {
                        try {
                            const auditLog = JSON.parse(message.body);
                            const userName = auditLog.fullName || auditLog.details || 'A user';
                            const newNotification: NotificationEvent = {
                                id: `lock-${Date.now()}`,
                                eventId: `user-lock-${auditLog.userId || Date.now()}`,
                                entityType: "USER",
                                entityId: auditLog.userId?.toString() || "",
                                action: "LOCK_USER",
                                title: "User Locked",
                                message: `User "${userName}" has been locked!`,
                                targetPrivileges: new Set(),
                                isGlobal: true,
                                isRead: false,
                                createdAt: new Date(),
                                createdBy: "System",
                                data: auditLog
                            };
                            
                            addIamNotification(newNotification);
                        } catch (e) {
                            console.error("Error parsing user lock notification:", e);
                        }
                    }
                });

                // User unlocked notifications
                iamClient.subscribe("/topic/userUnlocked", (message) => {
                    if (message.body) {
                        try {
                            const auditLog = JSON.parse(message.body);
                            const userName = auditLog.fullName || auditLog.details || 'A user';
                            const newNotification: NotificationEvent = {
                                id: `unlock-${Date.now()}`,
                                eventId: `user-unlock-${auditLog.userId || Date.now()}`,
                                entityType: "USER",
                                entityId: auditLog.userId?.toString() || "",
                                action: "UNLOCK_USER",
                                title: "User Unlocked",
                                message: `User "${userName}" has been unlocked!`,
                                targetPrivileges: new Set(),
                                isGlobal: true,
                                isRead: false,
                                createdAt: new Date(),
                                createdBy: "System",
                                data: auditLog
                            };
                            
                            addIamNotification(newNotification);
                        } catch (e) {
                            console.error("Error parsing user unlock notification:", e);
                        }
                    }
                });

                // User deleted notifications
                iamClient.subscribe("/topic/userDeleted", (message) => {
                    if (message.body) {
                        try {
                            const auditLog = JSON.parse(message.body);
                            const userName = auditLog.fullName || auditLog.details || 'A user';
                            const newNotification: NotificationEvent = {
                                id: `delete-${Date.now()}`,
                                eventId: `user-delete-${auditLog.userId || Date.now()}`,
                                entityType: "USER",
                                entityId: auditLog.userId?.toString() || "",
                                action: "DELETE_USER",
                                title: "User Deleted",
                                message: `User "${userName}" has been deleted!`,
                                targetPrivileges: new Set(),
                                isGlobal: true,
                                isRead: false,
                                createdAt: new Date(),
                                createdBy: "System",
                                data: auditLog
                            };
                            
                            addIamNotification(newNotification);
                        } catch (e) {
                            console.error("Error parsing user delete notification:", e);
                        }
                    }
                });

                // User created notifications
                iamClient.subscribe("/topic/userCreated", (message) => {
                    if (message.body) {
                        try {
                            const user = JSON.parse(message.body);
                            const newNotification: NotificationEvent = {
                                id: `create-${Date.now()}`,
                                eventId: `user-create-${user.id || Date.now()}`,
                                entityType: "USER",
                                entityId: user.id?.toString() || "",
                                action: "CREATE_USER",
                                title: "New User Created",
                                message: `New user "${user.fullName}" has been created!`,
                                targetPrivileges: new Set(),
                                isGlobal: true,
                                isRead: false,
                                createdAt: new Date(),
                                createdBy: "System",
                                data: user
                            };
                            
                            addIamNotification(newNotification);
                        } catch (e) {
                            console.error("Error parsing user create notification:", e);
                        }
                    }
                });
            },
        });

        patientClient.activate();
        iamClient.activate();
        stompClient.current = patientClient;

        return () => {
            patientClient?.deactivate();
            iamClient?.deactivate();
        };
    }, []);

    // Effect to update unread count when in-memory notifications change
    useEffect(() => {
        // Use setTimeout to avoid circular dependency issues and ensure localStorage is updated
        const timeoutId = setTimeout(() => {
            calculateUnreadCount();
        }, 100);
        
        return () => clearTimeout(timeoutId);
    }, [inMemoryNotifications]);

    // Effect to merge IAM notifications with patient notifications when IAM notifications are loaded
    useEffect(() => {
        if (inMemoryNotifications.length > 0) {
            setNotifications(prev => {
                // Get only patient notifications (filter out existing IAM notifications)
                const patientNotifications = prev.filter(n => 
                    n.entityType === "PATIENT" || n.entityType === "PATIENT_ORDER"
                );
                
                // Merge IAM notifications with patient notifications, IAM first (newest)
                return [...inMemoryNotifications, ...patientNotifications];
            });
        }
    }, [inMemoryNotifications]);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        loadNextPage,
        hasMore,
        loading,
        open,
        setOpen
    };
}

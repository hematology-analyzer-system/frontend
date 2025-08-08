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
    
    // Display management - how many notifications to show in the dropdown
    const [displayLimit, setDisplayLimit] = useState(5);

    const [loading, setLoading] = useState(false);

<<<<<<< HEAD
=======
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
        
        // Reset display limit when new notification comes in to ensure it's visible
        setDisplayLimit(prev => Math.max(prev, 5));
        
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

>>>>>>> d38a6574ccf9ebe9f867c8f2813bcbb3902bd1ab
    const fetchPageNotifications = async (pageNumber: number) => {
        try {
            setLoading(true);

<<<<<<< HEAD
            const res = await fetch(`https://fhard.khoa.email/api/patients/notifications/paging?page=${pageNumber}&size=4`, {
                credentials: "include"
            });
            const data = await res.json();
=======
            // Fetch from both services in parallel
            const [iamResponse, patientResponse] = await Promise.allSettled([
                fetch(`http://localhost:8080/iam/notifications/paging?page=${pageNumber}&size=5`, {
                    credentials: "include"
                }),
                fetch(`http://localhost:8081/patient/notifications/paging?page=${pageNumber}&size=5`, {
                    credentials: "include"
                })
            ]);
>>>>>>> d38a6574ccf9ebe9f867c8f2813bcbb3902bd1ab

            let allNewNotifications: any[] = [];
            let hasMoreIam = false;
            let hasMorePatient = false;

            // Process IAM service response
            if (iamResponse.status === 'fulfilled' && iamResponse.value.ok) {
                const iamData = await iamResponse.value.json();
                allNewNotifications.push(...(iamData.content || []));
                hasMoreIam = !iamData.last; // Spring Boot Page object has 'last' property
            } else {
                console.warn("IAM notification service unavailable");
            }

            // Process Patient service response
            if (patientResponse.status === 'fulfilled' && patientResponse.value.ok) {
                const patientData = await patientResponse.value.json();
                allNewNotifications.push(...(patientData.content || []));
                hasMorePatient = !patientData.last; // Spring Boot Page object has 'last' property
            } else {
                console.warn("Patient notification service unavailable");
            }

            // Sort combined notifications by creation date (newest first)
            allNewNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Check if there are more notifications from either service
            const stillHasMore = hasMoreIam || hasMorePatient;
            console.log(`Pagination debug - Page: ${pageNumber}, IAM hasMore: ${hasMoreIam}, Patient hasMore: ${hasMorePatient}, Total hasMore: ${stillHasMore}`);
            console.log(`Fetched ${allNewNotifications.length} new notifications`);
            setHasMore(stillHasMore);

            if (allNewNotifications.length === 0 && !stillHasMore) {
                return;
            }

            // Update notifications
            setNotifications((prev) => {
                const combined = [...prev, ...allNewNotifications];
                // Remove duplicates by id and sort by creation date
                const unique = combined.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                
                console.log(`Total notifications after update: ${unique.length}`);
                return unique;
            });
        } catch (err: any) {
            console.warn("Error fetching notifications:", err);
            // If both services are down, keep showing in-memory IAM notifications
            setNotifications(prev => {
                return [...inMemoryNotifications];
            });
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const loadNextPage = () => {
        if (displayLimit < notifications.length) {
            // If we have more notifications in memory, just show more of them
            setDisplayLimit(prev => prev + 5);
        } else if (hasMore && !loading) {
            // If we need to fetch more from backend
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPageNotifications(nextPage);
        }
    }

    // Helper function to get notifications to display (limited by displayLimit)
    const getDisplayedNotifications = () => {
        return notifications.slice(0, displayLimit);
    };

    // Helper function to check if we should show "See more" button
    const shouldShowMoreButton = () => {
        return displayLimit < notifications.length || hasMore;
    };

    // Helper function to calculate total unread count
    const calculateUnreadCount = async () => {
        try {
<<<<<<< HEAD
            const res = await fetch("https://fhard.khoa.email/api/patients/notifications/unread-count", {
                credentials: "include",
            });
            const data = await res.json();
            setUnreadCount(data);
=======
            // Get unread count from both services in parallel
            const [iamResponse, patientResponse] = await Promise.allSettled([
                fetch("http://localhost:8080/iam/notifications/unread-count", {
                    credentials: "include",
                }),
                fetch("http://localhost:8081/patient/notifications/unread-count", {
                    credentials: "include",
                })
            ]);

            let totalUnreadCount = 0;

            // Process IAM service response
            if (iamResponse.status === 'fulfilled' && iamResponse.value.ok) {
                const iamCount = await iamResponse.value.json();
                totalUnreadCount += iamCount;
            } else {
                console.warn("IAM notification service unavailable for unread count");
            }

            // Process Patient service response
            if (patientResponse.status === 'fulfilled' && patientResponse.value.ok) {
                const patientCount = await patientResponse.value.json();
                totalUnreadCount += patientCount;
            } else {
                console.warn("Patient notification service unavailable for unread count");
            }

            // Add in-memory IAM notifications unread count (for backward compatibility)
            const savedIamNotifications = localStorage.getItem('iam-notifications');
            if (savedIamNotifications) {
                try {
                    const parsed: NotificationEvent[] = JSON.parse(savedIamNotifications);
                    const inMemoryUnread = parsed.filter(n => !n.isRead).length;
                    totalUnreadCount += inMemoryUnread;
                } catch (e) {
                    console.error('Error counting in-memory IAM notifications:', e);
                }
            }
            
            setUnreadCount(totalUnreadCount);
            return totalUnreadCount;
>>>>>>> d38a6574ccf9ebe9f867c8f2813bcbb3902bd1ab
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
<<<<<<< HEAD
            await fetch(`https://fhard.khoa.email/api/patients/notifications/${id}/read`, {
                method: "PUT",
                credentials: "include",
            });
            fetchPageNotifications(page);
            fetchUnreadCount();
=======
            // Check if it's an in-memory IAM notification (for backward compatibility)
            const isInMemoryIamNotification = inMemoryNotifications.some(n => n.id === id);
            
            if (isInMemoryIamNotification) {
                // Mark in-memory IAM notification as read
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
                // Try to mark as read in both services (we don't know which service owns this notification)
                const [iamResponse, patientResponse] = await Promise.allSettled([
                    fetch(`http://localhost:8080/iam/notifications/${id}/read`, {
                        method: "PUT",
                        credentials: "include",
                    }),
                    fetch(`http://localhost:8081/patient/notifications/${id}/read`, {
                        method: "PUT",
                        credentials: "include",
                    })
                ]);

                // Check if at least one service successfully marked it as read
                const iamSuccess = iamResponse.status === 'fulfilled' && iamResponse.value.ok;
                const patientSuccess = patientResponse.status === 'fulfilled' && patientResponse.value.ok;

                if (iamSuccess || patientSuccess) {
                    // Update the notification display
                    setNotifications(prev => 
                        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
                    );
                    
                    calculateUnreadCount();
                } else {
                    console.warn("Could not mark notification as read in any service");
                    // Still try to update the display optimistically
                    setNotifications(prev => 
                        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
                    );
                }
            }
>>>>>>> d38a6574ccf9ebe9f867c8f2813bcbb3902bd1ab
        } catch (err: any) {
            console.log("Error in mark an event read")
            throw err;
        }
    };

    const markAllAsRead = async () => {
        try {
<<<<<<< HEAD
            await fetch(`https://fhard.khoa.email/api/patients/notifications/mark-all-read`, {
                method: "PUT",
                credentials: "include",
=======
            // Try to mark all notifications as read in both services
            const [iamResponse, patientResponse] = await Promise.allSettled([
                fetch(`http://localhost:8080/iam/notifications/mark-all-read`, {
                    method: "PUT",
                    credentials: "include",
                }),
                fetch(`http://localhost:8081/patient/notifications/mark-all-read`, {
                    method: "PUT",
                    credentials: "include",
                })
            ]);

            // Log any service failures
            if (iamResponse.status === 'rejected' || !iamResponse.value.ok) {
                console.warn("IAM notification service unavailable for mark all as read");
            }
            if (patientResponse.status === 'rejected' || !patientResponse.value.ok) {
                console.warn("Patient notification service unavailable for mark all as read");
            }
            
            // Mark all in-memory IAM notifications as read (for backward compatibility)
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
>>>>>>> d38a6574ccf9ebe9f867c8f2813bcbb3902bd1ab
            });
            
            // Update the combined notifications
            setNotifications(prev => 
                prev.map(n => ({ ...n, isRead: true }))
            );
            
            // Try to fetch updated notifications
            try {
                fetchPageNotifications(page);
            } catch (fetchError) {
                console.warn("Could not fetch updated notifications:", fetchError);
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
        const initializeNotifications = async () => {
            await fetchPageNotifications(0);
            await fetchUnreadCount();
        };
        
        initializeNotifications();

<<<<<<< HEAD
        const socket = new SockJS("https://fhard.khoa.email/api/patients/ws");
        const client = new Client({
            webSocketFactory: () => socket,
=======
        // Patient service WebSocket connection
        const patientSocket = new SockJS("http://localhost:8081/patient/ws");
        const patientClient = new Client({
            webSocketFactory: () => patientSocket,
>>>>>>> d38a6574ccf9ebe9f867c8f2813bcbb3902bd1ab
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
                const merged = [...inMemoryNotifications, ...patientNotifications];
                
                // Check if we should show "See more" button
                // If we have more than 5 total notifications, there might be more to load
                if (merged.length > 5 && !hasMore) {
                    setHasMore(true);
                }
                
                return merged;
            });
        }
    }, [inMemoryNotifications]);

    return {
        notifications: getDisplayedNotifications(),
        allNotifications: notifications, // Keep reference to all notifications
        unreadCount,
        markAsRead,
        markAllAsRead,
        loadNextPage,
        hasMore: shouldShowMoreButton(),
        loading,
        open,
        setOpen: (isOpen: boolean) => {
            setOpen(isOpen);
            // Reset display limit when opening dropdown
            if (isOpen) {
                setDisplayLimit(5);
            }
        }
    };
}

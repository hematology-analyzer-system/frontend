export interface NotificationEvent {
  id: string;

  eventId: string;

  entityType: string;
  entityId: string;

  action: string;

  title: string
  message: string;

  targetPrivileges: Set<BigInteger>;
  isGlobal: boolean;

  isRead: boolean;

  createdAt: Date;
  createdBy: String;

  data: Object;
};
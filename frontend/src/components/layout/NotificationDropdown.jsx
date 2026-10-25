import { FiUsers, FiCpu, FiAlertTriangle, FiTool, FiBell, FiX } from "react-icons/fi";
import styles from "./Navbar.module.css";

function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  onDismissNotification,
}) {
  return (
    <div className={styles.notificationDropdown}>
      <div className={styles.notificationHeader}>
        <div className={styles.notificationTitleArea}>
          <h3>Notifications</h3>
          {unreadCount > 0 && (
            <span className={styles.unreadCountPill}>{unreadCount} new</span>
          )}
        </div>

        <div className={styles.notificationHeaderActions}>
          {unreadCount > 0 && (
            <button
              type="button"
              className={styles.notifActionBtn}
              onClick={onMarkAllAsRead}
            >
              Mark read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              className={`${styles.notifActionBtn} ${styles.danger}`}
              onClick={onClearAll}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className={styles.notificationList}>
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`${styles.notificationItem} ${
                item.unread ? styles.unread : ""
              }`}
              onClick={() => onNotificationClick(item.id)}
            >
              <div className={styles.notificationIconBadge}>
                {item.type === "customer" && <FiUsers />}
                {item.type === "device" && <FiCpu />}
                {item.type === "warranty" && <FiAlertTriangle />}
                {item.type === "request" && <FiTool />}
              </div>

              <div className={styles.notificationBody}>
                <div className={styles.notificationItemHeader}>
                  <span className={styles.notificationItemTitle}>{item.title}</span>
                  <span className={styles.notificationItemTime}>{item.time}</span>
                </div>
                <p className={styles.notificationItemMessage}>{item.message}</p>
              </div>

              <button
                type="button"
                className={styles.notifDismissBtn}
                aria-label="Dismiss notification"
                onClick={(e) => onDismissNotification(item.id, e)}
              >
                <FiX size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className={styles.notificationEmptyState}>
            <span className={styles.emptyBellIcon}>
              <FiBell size={24} />
            </span>
            <p className={styles.emptyTitle}>No notifications</p>
            <p className={styles.emptyDesc}>
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;

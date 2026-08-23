import React from "react";

function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  onDismissNotification,
}) {
  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <div className="notification-title-area">
          <h3>Notifications</h3>
          {unreadCount > 0 && (
            <span className="unread-count-pill">{unreadCount} new</span>
          )}
        </div>

        <div className="notification-header-actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="notif-action-btn"
              onClick={onMarkAllAsRead}
            >
              Mark read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              className="notif-action-btn danger"
              onClick={onClearAll}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`notification-item ${item.unread ? "unread" : ""}`}
              onClick={() => onNotificationClick(item.id)}
            >
              <div className={`notification-icon-badge ${item.type}`}>
                {item.type === "customer" && "👥"}
                {item.type === "device" && "💻"}
                {item.type === "warranty" && "⚠️"}
                {item.type === "request" && "⚡"}
              </div>

              <div className="notification-body">
                <div className="notification-item-header">
                  <span className="notification-item-title">{item.title}</span>
                  <span className="notification-item-time">{item.time}</span>
                </div>
                <p className="notification-item-message">{item.message}</p>
              </div>

              <button
                type="button"
                className="notif-dismiss-btn"
                aria-label="Dismiss notification"
                onClick={(e) => onDismissNotification(item.id, e)}
              >
                &times;
              </button>
            </div>
          ))
        ) : (
          <div className="notification-empty-state">
            <span className="empty-bell-icon">🔔</span>
            <p className="empty-title">No notifications</p>
            <p className="empty-desc">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;

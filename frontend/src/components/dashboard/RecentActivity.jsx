import "./RecentActivity.css";

const activities = [
  {
    id: 1,
    type: "customer",
    title: "New customer registered",
    description: "Rahul Sharma created a customer profile",
    time: "10 minutes ago"
  },
  {
    id: 2,
    type: "request",
    title: "Service request created",
    description: "Request #1024 was created for ASUS Vivobook",
    time: "35 minutes ago"
  },

  {
    id: 4,
    type: "warranty",
    title: "Warranty updated",
    description: "Warranty details updated for Dell Inspiron",
    time: "2 hours ago"
  }
];

function RecentActivity() {
  return (
    <section className="activity-card">

      <div className="activity-header">

        <div>
          <p className="section-label">
            TIMELINE
          </p>

          <h2>Recent Activity</h2>
        </div>

        <button className="view-all-button">
          View all →
        </button>

      </div>

      <div className="activity-list">

        {activities.map((activity) => (

          <div
            className="activity-item"
            key={activity.id}
          >

            <div className={`activity-dot ${activity.type}`}>
              ●
            </div>

            <div className="activity-content">

              <strong>
                {activity.title}
              </strong>

              <span>
                {activity.description}
              </span>

              <small>
                {activity.time}
              </small>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default RecentActivity;
import { useState } from "react";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import Badge from "../components/common/Badge/Badge";
import { useTheme } from "../contexts/ThemeContext";
import "./Settings.css";

function Settings() {
  const { theme, setTheme } = useTheme();
  const [alerts, setAlerts] = useState({
    serviceRequests: true,
    warranty: true,
    system: true
  });

  const [prefs, setPrefs] = useState({
    itemsPerPage: 10,
    emailNotifications: true
  });

  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = () => {
    setSuccessMsg("Settings saved successfully.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your DeviceNexus workspace and preferences."
        action={
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        }
      />

      {successMsg && <div className="settings-success-msg">{successMsg}</div>}

      <div className="settings-content">
        <Card>
          <h3>Workspace Settings</h3>
          <div className="settings-row">
            <div>
              <strong>Workspace Name</strong>
              <p>DeviceNexus</p>
            </div>
            <div>
              <strong>Workspace Status</strong>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
          <p className="settings-desc">Manage your DeviceNexus workspace configuration.</p>
        </Card>

        <Card>
          <h3>Appearance</h3>
          <div className="settings-pref-row">
            <label>Theme</label>
            <select 
              value={theme} 
              onChange={e => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </Card>

        <Card>
          <h3>Notification Preferences</h3>
          <div className="settings-toggle-row">
            <span>Service Request Alerts</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={alerts.serviceRequests} 
                onChange={e => setAlerts({...alerts, serviceRequests: e.target.checked})} 
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-toggle-row">
            <span>Warranty Alerts</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={alerts.warranty} 
                onChange={e => setAlerts({...alerts, warranty: e.target.checked})} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-toggle-row">
            <span>System Notifications</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={alerts.system} 
                onChange={e => setAlerts({...alerts, system: e.target.checked})} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </Card>

        <Card>
          <h3>User Preferences</h3>
          <div className="settings-pref-row">
            <label>Items per page</label>
            <select 
              value={prefs.itemsPerPage} 
              onChange={e => setPrefs({...prefs, itemsPerPage: Number(e.target.value)})}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="settings-toggle-row mt-3">
            <span>Email Notifications</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={prefs.emailNotifications} 
                onChange={e => setPrefs({...prefs, emailNotifications: e.target.checked})} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
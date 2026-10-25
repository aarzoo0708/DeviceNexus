import { useNavigate } from "react-router";
import { FiUserCheck, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import styles from "./Navbar.module.css";

function ProfileDropdown({ user, onClose, onOpenLogin, onSignOut }) {
  const navigate = useNavigate();

  return (
    <div className={styles.profileDropdown}>
      <div className={styles.dropdownHeader}>
        <span className={styles.dropdownName}>{user?.name || "Admin"}</span>
        <span className={styles.dropdownRole}>{user?.role || "Service Manager"}</span>
      </div>
      <div className={styles.dropdownDivider} />

      <button
        className={styles.dropdownItem}
        type="button"
        onClick={onOpenLogin}
      >
        <span className={styles.dropdownIcon}>
          <FiUserCheck />
        </span>
        Switch Demo User
      </button>

      <button
        className={styles.dropdownItem}
        type="button"
        onClick={() => {
          navigate("/profile");
          onClose();
        }}
      >
        <span className={styles.dropdownIcon}>
          <FiUser />
        </span>
        My Profile
      </button>

      <button
        className={styles.dropdownItem}
        type="button"
        onClick={() => {
          navigate("/settings");
          onClose();
        }}
      >
        <span className={styles.dropdownIcon}>
          <FiSettings />
        </span>
        Workspace Settings
      </button>

      <div className={styles.dropdownDivider} />

      <button
        className={`${styles.dropdownItem} ${styles.textDanger}`}
        type="button"
        onClick={onSignOut}
      >
        <span className={styles.dropdownIcon}>
          <FiLogOut />
        </span>
        Sign Out (Guest Mode)
      </button>
    </div>
  );
}

export default ProfileDropdown;

import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import Badge from "../components/common/Badge/Badge";

function Settings() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your DeviceNexus workspace and preferences."
        action={
          <Button>
            Save Changes
          </Button>
        }
      />

      <Card>
        <h3>Workspace Settings</h3>

        <p>
          Manage your DeviceNexus workspace configuration.
        </p>

        <Badge variant="success">
          Active
        </Badge>
      </Card>
    </div>
  );
}

export default Settings;
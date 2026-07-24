import Card from "../components/common/Card";
import Button from "../components/common/Button";

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Settings
      </h1>

      <Card title="Preferences">

        <div className="space-y-6">

          <div className="flex justify-between items-center">

            <span>Dark Mode</span>

            <input
              type="checkbox"
              className="w-5 h-5"
            />

          </div>

          <div className="flex justify-between items-center">

            <span>Email Notifications</span>

            <input
              type="checkbox"
              className="w-5 h-5"
            />

          </div>

          <div className="flex justify-between items-center">

            <span>Public Profile</span>

            <input
              type="checkbox"
              className="w-5 h-5"
            />

          </div>

          <Button>
            Save Changes
          </Button>

        </div>

      </Card>

    </div>
  );
};

export default Settings;
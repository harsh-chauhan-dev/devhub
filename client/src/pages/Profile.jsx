import Card from "../components/common/Card";
import Button from "../components/common/Button";

const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Profile
      </h1>

      <Card>

        <div className="flex flex-col md:flex-row gap-8">

          <img
            src="https://i.pravatar.cc/150"
            alt="Profile"
            className="w-36 h-36 rounded-full"
          />

          <div className="space-y-3">

            <h2 className="text-2xl font-bold">
              Harsh Chauhan
            </h2>

            <p className="text-gray-500">
              Full Stack Developer
            </p>

            <p>
              Passionate about building scalable web
              applications and learning system design.
            </p>

            <div className="flex flex-wrap gap-2">

              <span className="px-3 py-1 rounded-full bg-indigo-100">
                React
              </span>

              <span className="px-3 py-1 rounded-full bg-indigo-100">
                Node.js
              </span>

              <span className="px-3 py-1 rounded-full bg-indigo-100">
                PostgreSQL
              </span>

              <span className="px-3 py-1 rounded-full bg-indigo-100">
                Express
              </span>

            </div>

            <Button>
              Edit Profile
            </Button>

          </div>

        </div>

      </Card>

    </div>
  );
};

export default Profile;
import Card from "../common/Card";

const GithubWidget = () => {
  return (
    <Card title="GitHub Profile">

      <div className="space-y-4">

        <div className="flex items-center gap-4">

          <img
            src="https://i.pravatar.cc/80"
            alt="profile"
            className="w-16 h-16 rounded-full"
          />

          <div>

            <h2 className="font-bold text-lg">
              Harsh Chauhan
            </h2>

            <p className="text-gray-500">
              Full Stack Developer
            </p>

          </div>

        </div>

        <div className="grid grid-cols-3 text-center">

          <div>
            <h3 className="font-bold">18</h3>
            <p className="text-sm text-gray-500">
              Repos
            </p>
          </div>

          <div>
            <h3 className="font-bold">52</h3>
            <p className="text-sm text-gray-500">
              Followers
            </p>
          </div>

          <div>
            <h3 className="font-bold">12</h3>
            <p className="text-sm text-gray-500">
              Following
            </p>
          </div>

        </div>

      </div>

    </Card>
  );
};

export default GithubWidget;
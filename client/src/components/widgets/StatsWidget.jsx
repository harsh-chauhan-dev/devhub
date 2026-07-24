import Card from "../common/Card";

const StatsWidget = () => {
  return (
    <Card title="Statistics">

      <div className="space-y-4">

        <div>

          <div className="flex justify-between mb-1">

            <span>Projects</span>

            <span>80%</span>

          </div>

          <div className="w-full h-3 bg-gray-200 rounded">

            <div className="w-4/5 h-full bg-indigo-600 rounded"></div>

          </div>

        </div>

        <div>

          <div className="flex justify-between mb-1">

            <span>Tasks</span>

            <span>60%</span>

          </div>

          <div className="w-full h-3 bg-gray-200 rounded">

            <div className="w-3/5 h-full bg-green-500 rounded"></div>

          </div>

        </div>

      </div>

    </Card>
  );
};

export default StatsWidget;
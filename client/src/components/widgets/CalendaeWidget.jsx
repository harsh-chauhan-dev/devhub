import Card from "../common/Card";

const CalendarWidget = () => {
  return (
    <Card title="Upcoming">

      <div className="space-y-4">

        <div className="border-l-4 border-indigo-500 pl-3">

          <h3 className="font-semibold">
            React Interview
          </h3>

          <p className="text-sm text-gray-500">
            July 25 • 10:00 AM
          </p>

        </div>

        <div className="border-l-4 border-green-500 pl-3">

          <h3 className="font-semibold">
            Finish DevHub
          </h3>

          <p className="text-sm text-gray-500">
            July 28
          </p>

        </div>

      </div>

    </Card>
  );
};

export default CalendarWidget;
import Card from "../components/common/Card";

const Dashboard = () => {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

        <Card title="GitHub">
          GitHub Widget
        </Card>

        <Card title="Todos">
          Todo Widget
        </Card>

        <Card title="Notes">
          Notes Widget
        </Card>

        <Card title="Weather">
          Weather Widget
        </Card>

        <Card title="Calendar">
          Calendar Widget
        </Card>

        <Card title="Statistics">
          Statistics Widget
        </Card>

      </div>

    </div>
  );
};

export default Dashboard;
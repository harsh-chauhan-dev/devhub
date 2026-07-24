import GithubWidget from "../components/widgets/GithubWidget";
import TodoWidget from "../components/widgets/TodoWidget";
import NotesWidget from "../components/widgets/NotesWidget";
import WeatherWidget from "../components/widgets/WeatherWidget";
import CalendarWidget from "../components/widgets/CalendarWidget";
import StatsWidget from "../components/widgets/StatsWidget";

const Dashboard = () => {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <GithubWidget />

        <TodoWidget />

        <NotesWidget />

        <WeatherWidget />

        <CalendarWidget />

        <StatsWidget />

      </div>

    </div>
  );
};

export default Dashboard;
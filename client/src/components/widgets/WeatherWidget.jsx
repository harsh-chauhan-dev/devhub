import Card from "../common/Card";

const WeatherWidget = () => {
  return (
    <Card title="Weather">

      <div className="text-center">

        <h2 className="text-5xl">
            ☀️
        </h2>

        <h1 className="text-4xl font-bold mt-3">
          32°C
        </h1>

        <p className="text-gray-500 mt-2">
          Meerut, India
        </p>

      </div>

    </Card>
  );
};

export default WeatherWidget;
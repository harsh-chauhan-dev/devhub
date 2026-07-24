import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}

          <div>

            <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-medium">
              Developer Dashboard
            </span>

            <h1 className="text-5xl font-bold mt-6 leading-tight">
              Organize Your
              <span className="text-indigo-600">
                {" "}Developer Life
              </span>
            </h1>

            <p className="text-gray-600 mt-6 text-lg leading-8">
              DevHub combines GitHub statistics, notes,
              todos, weather, productivity tools,
              and analytics into one beautiful dashboard.
            </p>

            <div className="flex gap-4 mt-10">

              <Link
                to="/register"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100"
              >
                Login
              </Link>

            </div>

          </div>

          {/* Right */}

          <div>

            <div className="bg-white rounded-2xl shadow-xl p-8">

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-indigo-50 rounded-xl p-6">
                  <h2 className="font-semibold">
                    GitHub
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Repository Statistics
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h2 className="font-semibold">
                    Todos
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Manage Tasks
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6">
                  <h2 className="font-semibold">
                    Notes
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Quick Notes
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h2 className="font-semibold">
                    Analytics
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Coding Insights
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Landing;
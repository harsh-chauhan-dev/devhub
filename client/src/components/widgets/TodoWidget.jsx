import Card from "../common/Card";

const todos = [
  "Authentication API",
  "React Dashboard",
  "Deploy Project"
];

const TodoWidget = () => {
  return (
    <Card title="Today's Tasks">

      <ul className="space-y-3">

        {todos.map((todo, index) => (

          <li
            key={index}
            className="flex items-center gap-3"
          >

            <input type="checkbox" />

            <span>{todo}</span>

          </li>

        ))}

      </ul>

    </Card>
  );
};

export default TodoWidget;
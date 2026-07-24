import Card from "../common/Card";

const NotesWidget = () => {
  return (
    <Card title="Quick Notes">

      <textarea
        placeholder="Write your notes..."
        rows="7"
        className="w-full border rounded-lg p-3 resize-none outline-none"
      />

    </Card>
  );
};

export default NotesWidget;
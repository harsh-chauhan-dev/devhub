const Card = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-200">

      {title && (
        <h2 className="text-lg font-semibold mb-4">
          {title}
        </h2>
      )}

      {children}

    </div>
  );
};

export default Card;
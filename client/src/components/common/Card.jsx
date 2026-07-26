const Card = ({ title, children, className = "", action }) => {
  return (
    <div className={`devhub-card p-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2 tracking-tight">
            {title}
          </h2>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
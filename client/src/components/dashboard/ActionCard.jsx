const ActionCard = ({ 
  onClick, 
  icon, 
  title, 
  description, 
  bgColor = 'bg-primary',
  borderColor = 'border-primary',
  iconBg = 'bg-primary'
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-8 ${bgColor}/10 ${borderColor}/30 border-2 rounded-xl 
        text-left cursor-pointer transition-all duration-300 
        hover:-translate-y-1 hover:shadow-lg hover:${bgColor}/20
        group
      `}
    >
      <div className={`
        w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center 
        mb-4 group-hover:scale-110 transition-transform
      `}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-dark mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </button>
  );
};

export default ActionCard;

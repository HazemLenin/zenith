const Card = ({ children }) => {
  return (
    <div className="flex items-center justify-between w-full  bg-white border-l-4 border-[#2a5c8a] rounded-md shadow-md hover:shadow-lg transition-all duration-300 p-4">
      <div className="flex flex-col justify-center pr-4">{children}</div>
    </div>
  );
};

export default Card;

interface CardProps {
  children: React.ReactNode;
  fun?:(event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card = ({ children, fun }: CardProps) => {
  return (
    <div onClick={fun} className="flex items-center  justify-between w-full mb-1   bg-white border-l-4 border-[#2a5c8a] rounded-md shadow-md hover:shadow-lg transition-all duration-300 p-4">
      <div className="flex flex-col justify-center pr-4">{children}</div>
    </div>
  );
};

export default Card;

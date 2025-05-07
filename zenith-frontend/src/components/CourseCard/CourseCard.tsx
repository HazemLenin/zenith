import React from "react";

interface Course {
  title?: string;
  description?: string;
  price?: number;
}

interface CourseCardProps {
  course?: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course = {} }) => {
  const {
    title = "Modern Web Development",
    description = "Learn how to build full-stack web apps using React and Node.js.",
    price = 199,
  } = course;

  return (
    <div className="flex items-center justify-between w-full max-w-md bg-white border-l-4 border-[#2a5c8a] rounded-md shadow-md hover:shadow-lg transition-all duration-300 p-4">
      <div className="flex flex-col justify-center pr-4">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="text-right">
        <span className="text-xl font-bold text-[#2a5c8a]">${price}</span>
      </div>
    </div>
  );
};

export default CourseCard;
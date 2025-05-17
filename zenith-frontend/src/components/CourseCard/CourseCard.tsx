import React from "react";
import { Link } from "react-router-dom";

interface Course {
  id: string;
  title?: string;
  description?: string;
  price?: number;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const {
    id,
    title = "Modern Web Development",
    description = "Learn how to build full-stack web apps using React and Node.js.",
    price = 199,
  } = course;

  return (
    <Link
      to={`/courses/${id}`}
      className="flex items-center justify-between w-full max-w-md bg-[#f3f4f6] border-l-4 border-[#ff9800] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 cursor-pointer"
    >
      <div className="flex flex-col justify-center pr-4">
        <h3 className="text-lg font-bold text-[#2a5c8a] mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="text-right">
        <span className="inline-block bg-[#ff9800] text-white text-base font-bold px-4 py-1 rounded-full shadow-sm">
          ${price}
        </span>
      </div>
    </Link>
  );
};

export default CourseCard;

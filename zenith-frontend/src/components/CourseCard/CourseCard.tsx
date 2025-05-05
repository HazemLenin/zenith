import React from "react";


interface Instructor {
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Course {
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  instructor?: Instructor;
  rating?: number;
  ratingText?: string;
}

const CourseCard: React.FC<{ course?: Course }> = ({ course = {} }) => {
  const {
    title = "Modern Web Development",
    description = "Learn how to build full-stack web apps using React and Node.js.",
    price = 199,
    image = "/images/course-img.jfif",
    instructor = {
      firstName: "Sara",
      lastName: "Johnson",
      avatar: "/images/instructor-img.webp",
    },
    rating = 4.5,
    ratingText = "4.5",
  } = course; 

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition">
      <div className="bg-gray-100 p-4 border-b border-gray-300">
        <img
          className="rounded-lg w-full h-40 object-cover"
          src={image}
          alt={title}
        />
      </div>

      <div className="px-4 py-3">
        <h5 className="text-md font-semibold text-gray-900 mb-1">{title}</h5>
        <p className="text-sm text-gray-600 mb-3">{description}</p>

        <div className="flex items-center gap-2 mb-3">
          <img
            src={instructor.avatar}
            alt={instructor.firstName}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-gray-800">
            {instructor.firstName} {instructor.lastName}
          </span>
        </div>

        <div className="flex items-center mb-3 gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          ))}
          <span className="text-xs text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
            {ratingText}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${price}</span>
          <button className="text-white bg-[#2a5c8a] hover:bg-blue-800 font-medium rounded-lg text-xs px-4 py-2">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
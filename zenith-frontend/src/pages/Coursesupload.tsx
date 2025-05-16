import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Chapter {
  title: string;
  videos: string[];
  articles: string[];
}

const Coursesupload: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [chapters, setChapters] = useState<Chapter[]>(
    [{ title: "", videos: [""], articles: [""] }]
  );

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      { title: "", videos: [""], articles: [""] },
    ]);
  };

  const handleChapterChange = (
    index: number,
    field: keyof Chapter,
    value: string
  ) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value as any;
    setChapters(updatedChapters);
  };

  const handleVideoChange = (
    chapterIndex: number,
    videoIndex: number,
    value: string
  ) => {
    const updated = [...chapters];
    updated[chapterIndex].videos[videoIndex] = value;
    setChapters(updated);
  };

  const handleArticleChange = (
    chapterIndex: number,
    articleIndex: number,
    value: string
  ) => {
    const updated = [...chapters];
    updated[chapterIndex].articles[articleIndex] = value;
    setChapters(updated);
  };

  const addVideo = (index: number) => {
    const updated = [...chapters];
    updated[index].videos.push("");
    setChapters(updated);
  };

  const addArticle = (index: number) => {
    const updated = [...chapters];
    updated[index].articles.push("");
    setChapters(updated);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title,
      description,
      chapters,
    };
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:3000/api/courses",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Course uploaded successfully!");
     
    } catch (err: any) {
      alert("Error uploading course: " + (err?.response?.data?.message || ""));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f2fd] to-[#f8fafc] py-10">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-[#2a5c8a] tracking-tight">
          Upload New Course
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-[#2f327d] mb-2">
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Enter course title"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] bg-[#f8fafc]"
            />
          </div>

          <div className="mb-8">
            <label className="block text-lg font-semibold text-[#2f327d] mb-2">
              Course Description
            </label>
            <textarea
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Enter course description"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] bg-[#f8fafc] min-h-[80px]"
            />
          </div>

          <h2 className="text-2xl font-bold text-[#2a5c8a] mb-4">
            Chapters
          </h2>

          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapterIndex}
              className="border-l-4 border-[#2a5c8a] bg-[#f3f4f6] rounded-xl p-5 mb-8 shadow-sm"
            >
              <div className="mb-4">
                <label className="block text-base font-semibold text-[#2f327d] mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChapterChange(chapterIndex, "title", e.target.value)
                  }
                  placeholder="Enter chapter title"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] bg-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-base font-semibold text-[#2f327d] mb-1">
                  Videos
                </label>
                {chapter.videos.map((video, videoIndex) => (
                  <input
                    key={videoIndex}
                    type="text"
                    value={video}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleVideoChange(chapterIndex, videoIndex, e.target.value)
                    }
                    placeholder="Vimeo link"
                    className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] bg-white"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addVideo(chapterIndex)}
                  className="mt-1 text-sm text-white bg-[#2a5c8a] px-4 py-1 rounded-md hover:bg-[#204768] transition-all"
                >
                  + Add Video
                </button>
              </div>

              <div>
                <label className="block text-base font-semibold text-[#2f327d] mb-1">
                  Articles
                </label>
                {chapter.articles.map((article, articleIndex) => (
                  <input
                    key={articleIndex}
                    type="text"
                    value={article}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleArticleChange(
                        chapterIndex,
                        articleIndex,
                        e.target.value
                      )
                    }
                    placeholder="Article link"
                    className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] bg-white"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addArticle(chapterIndex)}
                  className="mt-1 text-sm text-white bg-[#2a5c8a] px-4 py-1 rounded-md hover:bg-[#204768] transition-all"
                >
                  + Add Article
                </button>
              </div>
            </div>
          ))}

          <div className="mb-6">
            <button
              type="button"
              onClick={handleAddChapter}
              className="w-full text-white bg-[#2a5c8a] px-4 py-2 rounded-lg hover:bg-[#204768] transition-all font-semibold"
            >
              + Add Chapter
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-lg font-bold transition-all"
          >
            Submit Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default Coursesupload;

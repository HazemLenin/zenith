import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";

interface Video {
  title: string;
  url: string;
}

interface Article {
  title: string;
  content: string;
}

interface Chapter {
  title: string;
  videos: Video[];
  articles: Article[];
  order: number;
}

const CourseUpload: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      title: "",
      videos: [{ title: "", url: "" }],
      articles: [{ title: "", content: "" }],
      order: 0,
    },
  ]);
  const { currentUser, userToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      {
        title: "",
        videos: [{ title: "", url: "" }],
        articles: [{ title: "", content: "" }],
        order: chapters.length,
      },
    ]);
  };

  const handleChapterChange = (
    index: number,
    field: keyof Chapter,
    value: string | number
  ) => {
    const updatedChapters = [...chapters];
    if (field === "order") {
      updatedChapters[index].order = value as number;
    } else if (field === "title") {
      updatedChapters[index].title = value as string;
    }
    setChapters(updatedChapters);
  };

  const handleVideoChange = (
    chapterIndex: number,
    videoIndex: number,
    field: keyof Video,
    value: string
  ) => {
    const updated = [...chapters];
    updated[chapterIndex].videos[videoIndex][field] = value;
    setChapters(updated);
  };

  const handleArticleChange = (
    chapterIndex: number,
    articleIndex: number,
    field: keyof Article,
    value: string
  ) => {
    const updated = [...chapters];
    updated[chapterIndex].articles[articleIndex][field] = value;
    setChapters(updated);
  };

  const addVideo = (index: number) => {
    const updated = [...chapters];
    updated[index].videos.push({ title: "", url: "" });
    setChapters(updated);
  };

  const addArticle = (index: number) => {
    const updated = [...chapters];
    updated[index].articles.push({ title: "", content: "" });
    setChapters(updated);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      chapters: chapters.map((chapter, index) => ({
        ...chapter,
        order: index,
        videos: chapter.videos.map((video) => ({
          title: video.title,
          url: video.url,
        })),
        articles: chapter.articles.map((article) => ({
          title: article.title,
          content: article.content,
        })),
      })),
    };
    axios
      .post("http://localhost:3000/api/courses", data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(() => {
        navigate(`/users/${currentUser?.username}`);
      })
      .catch((error) => {
        console.error(error);
        if (axios.isAxiosError(error)) {
          alert(
            "Error uploading course: " +
              (error.response?.data?.message || error.message)
          );
        } else {
          alert("An unexpected error occurred while uploading the course");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-primary tracking-tight">
          Upload New Course
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              label="Course Title"
              value={title}
              onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Enter course title"
              required
            />
          </div>

          <div className="mb-6">
            <Input
              label="Course Price"
              type="number"
              value={price.toString()}
              onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice(Number(e.target.value))
              }
              placeholder="Enter course price"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-xl mb-2 font-medium text-secondary-title">
              Course Description
            </label>
            <textarea
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Enter course description"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white min-h-[80px]"
            />
          </div>

          <h2 className="text-2xl font-bold text-primary mb-4">Chapters</h2>

          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapterIndex}
              className="border-l-4 border-primary rounded-xl p-5 mb-8 shadow-sm"
            >
              <div className="mb-4">
                <Input
                  label="Chapter Title"
                  value={chapter.title}
                  onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChapterChange(chapterIndex, "title", e.target.value)
                  }
                  placeholder="Enter chapter title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-base font-semibold text-secondary-title mb-1">
                  Videos
                </label>
                {chapter.videos.map((video, videoIndex) => (
                  <div key={videoIndex} className="mb-4">
                    <Input
                      value={video.title}
                      onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
                        handleVideoChange(
                          chapterIndex,
                          videoIndex,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Video Title"
                    />
                    <Input
                      value={video.url}
                      onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
                        handleVideoChange(
                          chapterIndex,
                          videoIndex,
                          "url",
                          e.target.value
                        )
                      }
                      placeholder="Video URL"
                    />
                  </div>
                ))}
                <Button onClick={() => addVideo(chapterIndex)} className="mt-4">
                  + Add Video
                </Button>
              </div>

              <div>
                <label className="block text-base font-semibold text-secondary-title mb-1">
                  Articles
                </label>
                {chapter.articles.map((article, articleIndex) => (
                  <div key={articleIndex} className="mb-4">
                    <Input
                      value={article.title}
                      onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
                        handleArticleChange(
                          chapterIndex,
                          articleIndex,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Article Title"
                    />
                    <textarea
                      value={article.content}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleArticleChange(
                          chapterIndex,
                          articleIndex,
                          "content",
                          e.target.value
                        )
                      }
                      placeholder="Article Content"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white min-h-[80px] mt-2"
                    />
                  </div>
                ))}
                <Button
                  onClick={() => addArticle(chapterIndex)}
                  className="mt-4"
                >
                  + Add Article
                </Button>
              </div>
            </div>
          ))}

          <div className="mb-6">
            <Button onClick={handleAddChapter}>+ Add Chapter</Button>
          </div>

          <Button type="submit" variant="primary">
            Submit Course
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CourseUpload;

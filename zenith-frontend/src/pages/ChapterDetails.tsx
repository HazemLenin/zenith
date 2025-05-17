import { useParams } from "react-router-dom";
import Card from "../components/Card/Card";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

interface Video {
  id: number;
  title: string;
  videoUrl: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
}

interface Chapter {
  id: number;
  title: string;
  orderIndex: number;
}

interface ChapterDetails {
  id: number;
  title: string;
  orderIndex: number;
  videos: Video[];
  articles: Article[];
}

export default function ChapterDetails() {
  const { coursId } = useParams();
  const { userToken } = useContext(UserContext);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterDetails, set_chapterDetails] = useState<ChapterDetails>({
    id: 0,
    title: "",
    orderIndex: 0,
    videos: [],
    articles: [],
  });

  // Function to convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // fetch cours chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/courses/${coursId}/chapters`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setChapters(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };
    if (coursId && userToken) {
      fetchChapters();
    }
  }, [coursId, userToken]);

  // fetch first chapter by default without click
  useEffect(() => {
    if (chapters.length > 0) {
      chapterDetails_handelar_function(chapters[0].id);
    }
  }, [chapters]);

  // fetch chapter details
  function chapterDetails_handelar_function(id?: number) {
    const fetchChapterDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/courses/${coursId}/chapters/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        set_chapterDetails(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };
    if (userToken) {
      fetchChapterDetails();
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold border-b-2 pb-4 mb-8">
        {chapterDetails.title}
      </h1>
      {/* Changed grid to flex-col on mobile, grid on larger screens */}
      <div className="flex flex-col md:grid md:grid-cols-[55%_45%] gap-8">
        {/* Video and description section */}
        <div className="space-y-6">
          {chapterDetails.videos && chapterDetails.videos.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {chapterDetails.videos[0].title}
              </h2>
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src={getEmbedUrl(chapterDetails.videos[0].videoUrl)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={chapterDetails.videos[0].title}
                ></iframe>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No video available for this chapter</p>
          )}

          {chapterDetails.articles && chapterDetails.articles.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {chapterDetails.articles[0].title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {chapterDetails.articles[0].content}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              No article available for this chapter
            </p>
          )}
        </div>
        {/* Chapter list section */}
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <Card
              key={chapter.id}
              fun={() => chapterDetails_handelar_function(chapter.id)}
            >
              <h1 className="text-xl font-semibold">{chapter.title}</h1>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

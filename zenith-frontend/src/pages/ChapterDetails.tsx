import { useParams } from "react-router-dom";
import Card from "../components/Card/Card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ChapterDetails() {
    const {coursId} = useParams();
    const [chapters, setChapters] = useState([
{
    id: 0,
    title: "Intro",
    order: 0
},
    {
    id: 1,
    title: "Basics",
    order: 0
},
    {
    id: 2,
    title: "Managing media assets",
    order: 0
},
    {
    id: 3,
    title: "Basic editing techniques",
    order: 0
},
    {
    id: 4,
    title: "Adding transitions",
    order: 0
},
    {
    id: 5,
    title: "Audio editing",
    order: 0
},
        ]);
    const [chapterDetails,set_chapterDetails]= useState({
    id: 0,
    title: "Video editing Certificate course",
    order: 0,
    videos: [
        {
            id: 0,
            title: "string",
            url: "https://www.youtube.com/embed/PsajoNBazGY"
        }
    ],
    articles: [
        {
            id: 0,
            title: "string",
            content: "Understanding the role of video editing in various industries Introduction to video editing software and tools Overview of different video file formats and resolutions Familiarization with the user interface and essential features of editing software"
        }
    ]
    })
        // fetch cours chapters 
        useEffect(() => {
            const fetchChapters = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/courses/${coursId}/chapters`);
                setChapters(response.data);
            } catch (error) {
                console.error('Error fetching chapters:', error);
            }
            };

            if (coursId) {
            fetchChapters();
            }
        }, [coursId]);
        // fetch chapter details 
        function chapterDetails_handelar_function(id?: number) {
            const fetchChapterDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/courses/${coursId}/chapters/${id}`);
                    set_chapterDetails(response.data);
                } catch (error) {
                    console.error('Error fetching chapters:', error);
                }
            }
            fetchChapterDetails();
        }
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold border-b-2 pb-4 mb-8">{chapterDetails.title}</h1>
            {/* Changed grid to flex-col on mobile, grid on larger screens */}
            <div className="flex flex-col md:grid md:grid-cols-[55%_45%] gap-8">
                {/* Video and description section */}
                <div className="space-y-6">
                    <div className="relative w-full pt-[56.25%]">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                            src={chapterDetails.videos[0].url}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{chapterDetails.articles[0].content}</p>
                </div>
                {/* Chapter list section */}
                <div className="space-y-4">
                    {
                        chapters.map((chapter)=>(
                            <Card key={chapter.id} fun={()=>chapterDetails_handelar_function(chapter.id)}>
                                <h1 className="text-xl font-semibold">{chapter.title}</h1>
                            </Card>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

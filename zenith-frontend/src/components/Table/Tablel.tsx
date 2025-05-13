import { ReactNode } from "react"

interface TableProps {
    data: (string | number | ReactNode)[][]
}



export default function Table({ data }: TableProps) {
    return (
        <div className="max-w-150 mx-auto my-5 flex flex-col gap-2">
            {
                data.map((row, index) => {
                    return (
                        <div key={index} className={`flex justify-between items-center shadow-md bg-background md:mx-auto w-full md:w-4/5 lg:w-3/5 border-primary ${row==data[0]?'rounded-t-xl border-t-4':row==data[data.length-1]?'rounded-b-xl border-b-4':''} p-4
                        `}>
                            {
                                row.map((cell, cellIndex) => (
                                    <span key={cellIndex} className="flex w-24 text-wrap">
                                        {cell}
                                        {cellIndex === 1 && typeof cell === 'number' && 
                                            <img className="w-8 h-8 ml-1.5" src="/public/points.png" />
                                        }
                                    </span>
                                ))
                            }
                        </div>
                    ) 
                })
            }
        </div>
    )
}

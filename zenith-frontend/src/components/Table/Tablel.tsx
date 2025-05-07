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
                        <div key={index} className={`flex justify-between items-center border-4 border-primary rounded-xl p-2`}>
                            {
                                row.map((cell, cellIndex) => (
                                    <span key={cellIndex} className="flex w-24 text-wrap">
                                        {cell}
                                        {cellIndex === 1 && typeof cell === 'number' && 
                                            <img className="w-8 h-8 ml-1.5" src="/public/icon-Photoroom.png" />
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

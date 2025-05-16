interface InputProps {
    btnName: string;
    variant: string;
    btnFun?: () => void;
    isDisabled: boolean;
}
export default function Btn({btnName,btnFun,variant,isDisabled}: InputProps) {
    return (
        <>
        <button  
        onClick={btnFun}      
        className=" w-56  py-3 px-4 
        bg-[#1a3c5a] text-white rounded-lg hover:bg-[#2a5c8a] 
        hover:cursor-pointer disabled:bg-[#2a5c8a]  
        flex items-center justify-center mx-auto transition-all 
        duration-300 ease-in-out focus:outline-none focus:ring-2 
        focus:ring-[#2a5c8a] focus:ring-offset-2"
        disabled={isDisabled}
        >
        {btnName}
        </button>
        </>
    )
}

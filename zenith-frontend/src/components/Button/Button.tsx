interface InputProps {
    btnName: string;
    variant?: string;
    btnFun?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isDisabled?: boolean;
}
export default function Btn({btnName,btnFun,variant,isDisabled}: InputProps) {

    return (
        <>
    <button  
    onClick={btnFun}      
    className= "w-28 py-3 px-3 bg-primary text-white rounded-lg hover:bg-background hover:text-black hover:cursor-pointer disabled:bg-primary-disabled  flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    disabled={isDisabled}
    >
        {btnName}
        </button>
        </>
    )
}
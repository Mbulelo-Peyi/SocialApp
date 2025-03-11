import { AiOutlineClose } from 'react-icons/ai';



const Modal = ({open,onClose,children}) =>{


    return (
        <div
        onClick={onClose}
        className={`
        fixed inset-0 flex justify-center z-[21] items-center transition-colors
        ${open ? 'visible bg-gradient-to-br from-slate-400 to-blue-300' : 'invisible'}
        `}
        >
            <div
            onClick={e=>{e.stopPropagation();}}
            className={`
            bg-white rounded-xl shadow p-6 transition-all max-h-screen  
            ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}
            `} 
            >
                <button 
                onClick={onClose}
                className="absolute top-4 right-3 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
                >
                    <AiOutlineClose />
                </button>
                {children}
            </div>
        </div>
    )
}
export default Modal;
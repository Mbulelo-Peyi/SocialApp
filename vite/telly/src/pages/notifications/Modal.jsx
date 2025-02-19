import { AiOutlineClose } from 'react-icons/ai';


const Modal = ({isVisible, onClose, children}) => {
  if (!isVisible) return null;
  let handleClose = (e)=>{
    if (e.target.id === "wrapper") onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex
    justify-center items-center z-20" id="wrapper" onClick={handleClose}>
      <div className="w-[600px] flex flex-col">
        <button className="text-white text-xl place-self-end rounded-full hover:bg-slate-400" onClick={()=>onClose()}>
          <AiOutlineClose size={24} />
        </button>
        <div className="bg-white p-2 rounded h-72 overflow-y-auto">
            {children}
        </div>
      </div>
    </div>
  )
}

export default Modal;
import { useLocation } from 'react-router-dom';



const AccountActivation = () =>{
    const location = useLocation();
    return(
        <main className="relative top-[105px] flex justify-center items-center">
            <div className="w-screen py-16 flex flex-col  rounded-xl px-3 justify-center">
                <p className="my-12 font-semibold font-monsterrat px-3 text-green-700 bg-green-300">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit <span className="font-palanquin font-bold">{location.state}</span>.
                </p>
            </div>
        </main>
    )
}
export default AccountActivation;
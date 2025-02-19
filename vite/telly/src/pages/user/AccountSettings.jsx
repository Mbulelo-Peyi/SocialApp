import { Link } from 'react-router-dom';

const AccountSettings = () => {

    return (
        <main className="relative top-[105px]">
            <div className="relative left-1/2 sm:w-[85vw] flex items-center max-sm:flex-col max-sm:flex-wrap w-[85vw] max-w-max -translate-x-1/2 px-4">
                <div className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg relative">
                    <h1 className="text-4xl text-white font-montserrat font-bold text-center mb-6">Account Settings</h1>
                </div>
                <div className="w-screen max-w-lg flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                    <div className="p-4">
                        <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                <svg className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                </svg>
                            </div>
                            <div>
                                <Link to={`/delete-account`} className="font-semibold text-gray-900">
                                    Delete Account
                                    <span className="relative inset-0"></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AccountSettings

import {
    BookmarkMinusIcon,
  } from "lucide-react"
import { Link } from "react-router-dom";


const NotFound  = ()=>{
    return(
        <div className="max-w-[50rem] flex flex-col mx-auto size-full relative top-[105px]">
            <main id="content">
                <div className="flex flex-col items-center text-center py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="block text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">404</h1>
                <p className="mt-3 text-gray-600 dark:text-neutral-400">Oops, something went wrong.</p>
                <p className="text-gray-600 dark:text-neutral-400">Sorry, we couldn't find your page.</p>
                <span className="py-2">
                    <BookmarkMinusIcon size={24} />
                </span>
                <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
                    <Link to={`/`}>
                        <button className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Home
                        </button>
                    </Link>
                </div>
                </div>
            </main>
            <footer className="mt-auto text-center py-5">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-sm text-gray-500 dark:text-neutral-500">© All Rights Reserved. 2022.</p>
                </div>
            </footer>
        </div>
    )
}
export default NotFound;
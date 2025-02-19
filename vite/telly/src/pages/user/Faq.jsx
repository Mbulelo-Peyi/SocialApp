import React,{ useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import axios from 'axios';

const Faq = () => {
    const BASE_URL = "http://127.0.0.1:8000";
    const targetRef = useRef();
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    
    const isInViewport = entry?.isIntersecting;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
    queryKey:['questions', 'infinite'],
    getNextPageParam: (lastPage) => {
        try {
            const nextPage = lastPage?.next ? lastPage?.next?.split('page=')[1] : null;
            return nextPage;
        } catch (error) {
            return null;
        };
    },
    queryFn: (pageParam)=> getQuestions(pageParam),

    });

    useEffect(()=>{
        if (isInViewport) {
            fetchNextPage();
        };
    },[isInViewport, entry])


    const getQuestions = async ({ pageParam = 1 }) =>{
        const config ={
            header:{
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await axios.get(
                `${BASE_URL}/api/frequent-questions/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
        }
    };

    const _data = data?.pages.flatMap(page => page?.results);

    return (
        <main className="relative top-[105px]">
            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
                    <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Your questions, answered</h2>
                    <p className="mt-1 text-gray-900 dark:text-neutral-400">Answers to the most frequently asked questions.</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="hs-accordion-group">
                        {!isLoading && (
                            <React.Fragment>
                                {_data?.length>0?(
                                    <React.Fragment>
                                        {_data?.map(question => (
                                            <div key={question?.id} className="max-w-full mx-auto p-8">
                                                <details className="open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg p-6 rounded-lg">
                                                    <summary className="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none">
                                                        {question?.question}
                                                    </summary>
                                                    <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                                        <p>
                                                            {question?.answer}
                                                        </p>
                                                    </div>
                                                </details>
                                            </div>
                                        ))}
                                        {(hasNextPage || isFetchingNextPage) && (
                                            <div className="flex flex-col items-center justify-center">
                                                <div ref={ref} className="h-1"></div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ):(
                                    <h3 className="font-monsterrat text-xl text-slate-900/80 text-bold leading-normal py-4">No questions yet ?</h3>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Faq;

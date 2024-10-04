export const StillHaveQue = () => {
    return (
        <div className="w-full h-fit border border-black py-[15dvh]">
            <div className="w-full h-full  max-w-[90%] mx-auto border border-black bg-primary-2/90 rounded-xl">
                <div className="w-full h-full flex justify-between items-center p-[15%]">
                    <div className="border border-black w-full h-fit flex flex-col gap-1.5 text-secondary-1">
                        <h1 className="font-bold text-4xl">Still have questions?</h1>
                        <p className="font-normal">
                            Join over +5000 creatives across Bicol Region and
                            share your work with others!
                        </p>
                    </div>
                    <div className="border border-black w-full h-fit ">
                        <QueButton />
                    </div>
                </div>
            </div>
        </div>
    )
}


const QueButton = () => {
    return (
        <div className="flex gap-8 justify-center items-center text-primary-2">
            <button className="capitalize w-32 rounded-full py-2 font-semibold bg-primary-3 ">learn more</button>
            <button className="capitalize w-32 rounded-full py-2 font-semibold bg-secondary-1 ">get started</button>
        </div>
    )
}
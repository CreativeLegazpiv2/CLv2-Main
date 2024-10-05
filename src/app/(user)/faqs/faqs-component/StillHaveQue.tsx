export const StillHaveQue = () => {
    return (
        <div className="w-full h-fit py-[15dvh]">
            <div className="w-full h-full max-w-[80%] mx-auto bg-quaternary-1 rounded-3xl">
                <div className="w-full h-full flex lg:flex-row flex-col gap-8 justify-between items-center px-[8%] lg:py-[12dvh] py-[5dvh]">
                    <div className="w-full h-fit flex flex-col lg:gap-2 gap-3 justify-center lg:items-start items-center text-secondary-1">
                        <h1 className="font-bold text-4xl lg:text-left text-center">Still have questions?</h1>
                        <p className="font-normal w-full text-lg max-w-md lg:text-left text-center">
                            Join over +5000 creatives across Bicol Region and
                            share your work with others!
                        </p>
                    </div>
                    <div className="w-full h-fit ">
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
            <button className="capitalize w-32 rounded-full py-2 font-semibold bg-shade-1 ">learn more</button>
            <button className="capitalize w-32 rounded-full py-2 font-semibold bg-secondary-1 ">get started</button>
        </div>
    )
}
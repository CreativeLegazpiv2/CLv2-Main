import { Icon } from "@iconify/react/dist/iconify.js";

export const CreativeHeroPage = () => {
    return (
        <div className="w-full h-fit text-primary-2">
            <div className="w-full lg:max-w-[70%] md:max-w-[80%] max-w-[90%] mx-auto">
                <div className="w-full flex md:flex-col flex-col-reverse gap-12">
                    <div className="w-full flex md:flex-row flex-col gap-4 md:justify-between justify-center items-center ">
                        <h1 className="md:w-full w-fit text-5xl font-semibold uppercase">Discover</h1>
                        <div className="w-full flex md:justify-end md:items-end justify-center items-center">
                            <SearchInput />
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-8 md:justify-start md:items-start items-center justify-center">
                        <TitleDetails /> 
                    </div>
                </div>
            </div>
        </div>
    )
}

const TitleDetails = () => {
    return (
        <div className="flex flex-col gap-8 md:justify-start md:items-start items-center justify-center">
            <h1 className="md:w-full w-fit max-w-sm md:text-6xl text-5xl font-extrabold uppercase leading-tight md:text-left text-center">creative directory</h1>
            <p className="font-normal text-lg md:w-full w-fit max-w-lg md:text-left text-center">
                Creative Legazpi is a vibrant hub of creativity that brings together a diverse range
                of artistic and cultural disciplines.
            </p>
        </div>
    )
}

const SearchInput = () => {
    return (
        <div className="w-full lg:max-w-xl max-w-sm h-fit relative text-primary-2 rounded-full">
            <input
                className="placeholder:text-primary-2 text-lg font-medium rounded-full bg-quaternary-2 ring-none 
                outline-none w-full py-2.5 px-14"
                type="text"
                placeholder="Search"
            />
            <Icon
                className="absolute top-1/2 -translate-y-1/2 left-4 text-primary-2"
                icon="cil:search"
                width="23"
                height="23"
            />
            <Icon // submit button for search
                // onClick={() => console.log("submit")}
                className=" cursor-pointer -mt-1 absolute top-[55%] -translate-y-1/2 right-4  text-primary-2"
                icon="iconamoon:send-thin" width="28" height="28" />
        </div>
    );
};
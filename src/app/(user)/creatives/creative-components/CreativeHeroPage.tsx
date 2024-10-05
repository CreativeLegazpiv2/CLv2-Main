import { Icon } from "@iconify/react/dist/iconify.js";

export const CreativeHeroPage = () => {
    return (
        <div className="w-full h-fit text-primary-2">
            <div className="w-full max-w-[70%] mx-auto border border-black">
                <div className="w-full flex flex-col gap-12">
                    <div className="w-full flex justify-between items-center ">
                        <h1 className="w-full text-5xl font-semibold border border-black uppercase">Discover</h1>
                        <div className="w-full flex justify-end items-end border border-black">
                            <SearchInput />
                        </div>
                    </div>
                    <div className="w-full">
                        <Title />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Title = () => {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="w-full max-w-sm text-6xl font-extrabold border border-black uppercase leading-tight">creative directory</h1>
            <p className="font-light text-lg w-full max-w-lg border border-black">
                Creative Legazpi is a vibrant hub of creativity that brings together a diverse range
                of artistic and cultural disciplines.
            </p>
        </div>
    )
}

const SearchInput = () => {
    return (
        <div className="w-full xl:max-w-xl lg:max-w-xl max-w-[90%] h-fit relative text-primary-2 rounded-full">
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
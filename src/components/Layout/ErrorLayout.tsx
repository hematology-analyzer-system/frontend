"use client";

import Image from "next/image";
import HurtBloodCartoon from "@/assets/images/HurtBloodCartoon.png";
import { useRouter } from "next/navigation";
// import NaiveBloodCartoon from "@/assets/images/NaiveBloodCartoon.png";
import MaintenanceIllustrator from "@/assets/images/maintenance_illustrator.png";

interface Props {
    children: React.ReactNode;
    title?: string,
    subTitle?: string,
    content?: string,

    inputArray?: string[],

    backgroundText1?: string,
    backgroundText2?: string,
}

export default function ErrorLayout({
    children,
    title = "Default title",
    subTitle = "Default subTitle",
    content = "Default content",

    inputArray = [],

    backgroundText1 = "Default1",
    backgroundText2 = "Default2",
}: Props) {

    // use router để quay trở lại
    const myRoute = useRouter();

    return (
        <div className="relative min-h-screen w-full grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-row-1 overflow-hidden">
            {/* Left side - error content */}
            <div className="relative z-1 row-start-1 md:col-start-1 md:row-span-2 flex flex-col items-start justify-center p-10 lg:pl-30 lg:pr-30 gap-y-5">
                <h1 className="text-title md:text-[35px] font-extrabold">
                    {title}</h1>

                <h3 className="text-subTitle">
                    {subTitle}</h3>

                <p className="text-normal">
                    {content}</p>

                {children}

                {inputArray.length > 0 &&
                    <button className="button max-w-3/4" onClick={() => myRoute.back()}>
                        Take me back</button>}
            </div>

            {/* Right side - decorator */}
            <div className="md:flex row-start-2 md:col-start-2 md:row-span-2 w-full items-center justify-center select-none">
                <div className="hidden md:flex relative z-1 flex-row items-center justify-center w-3/4 md:w-1/3 h-auto transform rotate-[25deg] scale-60 md:scale-100">
                    {inputArray.length > 0 ? inputArray.map((item, index) => (
                        item !== 'image' ? (
                            <h1 key={index}
                                className="text-[140px] md:text-[230px] font-extrabold text-primary
                                text-shadow-[5px_5px_3px_rgb(0_0_0_/_0.25)] text-shadow-primary-darker
                                rotate-[-30deg] m-0">
                                {item}
                            </h1>
                        ) : (
                            <Image
                                key={index}
                                src={HurtBloodCartoon}
                                alt="Blood cartoon"
                                className="aspect-auto scale-30 lg:scale-50 max-w-[300px] rotate-[-30deg]"
                            />
                        )
                    )) : (
                        <Image src={MaintenanceIllustrator} alt="Illustrator" className="rotate-[-25deg] scale-170"></Image>
                    )}
                </div>

                <h1 className="translate-y-2/3 md:flex absolute z-0 text-[150px] lg:text-[250px] font-black text-white opacity-90 rotate-[-50deg]">
                    {backgroundText1}</h1>
                <h1 className="-translate-y-2/3 -translate-x-1/5 md:flex absolute z-0 text-[150px] lg:text-[250px] font-black text-white opacity-90 rotate-[-50deg]">
                    {backgroundText2}</h1>
            </div>
        </div>
    );
}
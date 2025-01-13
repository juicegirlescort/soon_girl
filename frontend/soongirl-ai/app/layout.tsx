import type { Metadata } from "next";
import "./globals.css";
import { BackgroundHalo } from "@/components/background-halo";
import Link from "next/link";
import Birdeye from "@/public/birdeye.png";
import XLogo from "@/public/x-logo.png";
import { ElevenLabsLogo } from "@/components/logos";
import Image from "next/image";
import { Silkscreen } from 'next/font/google';

const silkscreen = Silkscreen({
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: "SOON Girl",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`h-full w-full ${silkscreen.className}`}>
            <body className={`antialiased w-full h-full flex flex-col text-white silkscreen-regular`}>
                <BackgroundHalo />
                <div className="flex flex-col flex-grow w-full items-center justify-center sm:px-4">
                    <nav
                        className={
                            "sm:fixed w-full top-0 left-0 grid grid-cols-2 py-4 px-8"
                        }
                    >
                        <div className={"flex"}>
                            <Link href={"/"} prefetch={true}>
                                <ElevenLabsLogo
                                    className={"h-[15px] w-auto hover:text-gray-500"}
                                />
                            </Link>
                        </div>

                        <div className={"flex gap-4 justify-end"}>
                            <Link href={"https://www.birdeye.so/"} prefetch={true}>
                                <Image
                                    src={Birdeye}
                                    alt={"Birdeye"}
                                    className={"h-10 w-auto hover:text-gray-500 -mt-2"}
                                />
                            </Link>
                            <Link href={"https://x.com/SOONGirl_"} prefetch={true}>
                                <Image
                                    src={XLogo}
                                    alt={"X Logo"}
                                    className={"h-5 w-auto hover:text-gray-500"}
                                />
                            </Link>
                        </div>
                    </nav>
                    {children}
                </div>
            </body>
        </html>
    );
}

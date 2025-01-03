"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DRNFullLogo from "@/public/Fullsize_Transparent.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function LoginPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  const handleResize = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [imageWidth, setImageWidth] = useState(500);
  const [imageHeight, setImageHeight] = useState(500);

  useEffect(() => {
    // based on screen size
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width > 1900) {
      setImageWidth(width / 4);
      setImageHeight(height / 4);
    }
  }, []);

  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [screenHeight, setScreenHeight] = useState<number>(0);
  const [isSuperSmallScreen, setIsSuperSmallScreen] = useState<boolean>(false);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);

    if (screenWidth < 340 || screenHeight < 500) {
      setIsSuperSmallScreen(true);
    }
  }, [screenWidth, screenHeight]);

  if (isSuperSmallScreen) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh w-full !p-0 !m-0 relative !bg-[var(--primary-grey)] overflow-y-auto">
        <Card
          className={`rounded-none border-none h-full w-full justify-center text-center !bg-[var(--primary-grey)] !max-w-full px-2 ${
            isBannerVisible ? "mt-8" : ""
          }`}
        >
          <CardHeader className="flex w-full justify-center">
            <Image
              src={DRNFullLogo}
              alt="Disc Rescue Network Logo"
              className="ml-auto mr-auto object-contain"
              placeholder="blur"
              layout="intrinsic"
              width={500}
              height={500}
            />
          </CardHeader>
          <CardTitle className="text-[3rem] lg:text-[110px] xl:text-[150px] !text-[var(--primary-red)] bebas-font fw-600 tracking-wide p-0 m-0 mt-5 xl:mb-[-50px] ">
            Hang tight!
          </CardTitle>
          <CardDescription className="text-[2rem] lg:text-[54px] xl:text-[75px] !text-[var(--primary-blue)] xl:leading-loose bebas-font p-0 fw-700 tracking-tight leading-none pr-6 pl-6 mb-7 lg:mb-5 xl:mb-0 ">
            Looks like you still need to sign in.
          </CardDescription>
          <CardContent className="!p-0">
            <div className="grid gap-4">
              <LoginLink
                postLoginRedirectURL="/"
                className="bebas-font tracking-wider items-center"
              >
                {" "}
                <Button
                  variant="default"
                  className="justify-center items-center m-auto text-center rounded-none !bg-[var(--primary-red)] !text-white !px-[50px] !py-[10px] !text-[1rem] lg:!text-[2rem] min-h-[40px] lg:min-h-[50px] xl:min-h-[70px] w-[60%] lg:w-[60%] xl:w-[40%]"
                >
                  Sign in
                </Button>
              </LoginLink>
              <RegisterLink postLoginRedirectURL="/">
                <Button
                  variant="secondary"
                  className="bebas-font tracking-wider !fw-300 justify-center items-center m-auto rounded-none !bg-white !border-[var(--primary-blue)] border-[2px] !text-[var(--primary-blue)] !text-[1rem] lg:!text-[1.5rem]  min-h-[40px] lg:min-h-[45px] xl:min-h-[65px] w-[50%] lg:w-[50%] xl:w-[35%]"
                >
                  Sign up
                </Button>
              </RegisterLink>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-[var(--primary-black)]">
            <div className="flex flex-col items-center space-y-2 text-sm text-gray-600 mt-8">
              <a
                href="https://www.discrescuenetwork.com/terms-conditions"
                className="underline bebas-font text-[14px] !text-[var(--primary-black)]"
              >
                View our Privacy Policy and Terms of Service
              </a>
              <span className="bebas-font text-[14px] !text-[var(--primary-black)]">
                Copyright 2024 Disc Rescue Network LLC
              </span>
              <div className="flex flex-col items-center text-[var(--primary-black)]">
                <span className="text-sm">Powered by</span>
                <span className="text-lg font-semibold">Kinde</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-dvh w-full !p-0 !m-0 relative !bg-[var(--primary-grey)] ">
      <Card
        className={`rounded-none border-none h-full w-full justify-center text-center !bg-[var(--primary-grey)] !max-w-full px-2 ${
          isBannerVisible ? "mt-8" : ""
        }`}
      >
        <CardHeader className="flex w-full justify-center">
          <Image
            src={DRNFullLogo}
            alt="Disc Rescue Network Logo"
            className="ml-auto mr-auto object-contain"
            placeholder="blur"
            layout="intrinsic"
            width={imageWidth}
            height={imageHeight}
          />
        </CardHeader>
        <CardTitle className="text-[77.5px] lg:text-[110px] xl:text-[150px] !text-[var(--primary-red)] bebas-font fw-600 tracking-wide p-0 m-0 mt-5 xl:mb-[-50px] ">
          Hang tight!
        </CardTitle>
        <CardDescription className="text-[40px] lg:text-[54px] xl:text-[75px] !text-[var(--primary-blue)] xl:leading-loose bebas-font p-0 fw-700 tracking-tight leading-none pr-6 pl-6 mb-7 lg:mb-5 xl:mb-0 ">
          Looks like you still need to sign in.
        </CardDescription>
        <CardContent className="!p-0">
          <div className="grid gap-4 xl:gap-8">
            <LoginLink
              postLoginRedirectURL="/"
              className="bebas-font tracking-wider items-center"
            >
              {" "}
              <Button
                variant="default"
                className="justify-center items-center m-auto text-center rounded-none !bg-[var(--primary-red)] !text-white !px-[50px] !py-[10px] !text-[1rem] lg:!text-[2rem] min-h-[40px] lg:min-h-[50px] xl:min-h-[70px] w-[60%] lg:w-[60%] xl:w-[40%] max-w-[750px]"
              >
                Sign in
              </Button>
            </LoginLink>
            <RegisterLink postLoginRedirectURL="/">
              <Button
                variant="secondary"
                className="bebas-font tracking-wider !fw-300 justify-center items-center m-auto rounded-none !bg-white !border-[var(--primary-blue)] border-[2px] !text-[var(--primary-blue)] !text-[1rem] lg:!text-[1.5rem]  min-h-[40px] lg:min-h-[45px] xl:min-h-[65px] w-[50%] lg:w-[50%] xl:w-[35%] max-w-[600px]"
              >
                Sign up
              </Button>
            </RegisterLink>
          </div>
        </CardContent>
      </Card>
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center space-y-2 text-sm text-gray-600">
        <a
          href="https://www.discrescuenetwork.com/terms-conditions"
          className="underline bebas-font text-[14px] !text-[var(--primary-black)]"
        >
          View our Privacy Policy and Terms of Service
        </a>
        <span className="bebas-font text-[14px] !text-[var(--primary-black)]">
          Copyright 2024 Disc Rescue Network LLC
        </span>
        <div className="flex flex-col items-center text-[var(--primary-black)]">
          <span className="text-sm">Powered by</span>
          <span className="text-lg font-semibold">Kinde</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

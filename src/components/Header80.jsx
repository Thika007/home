"use client";

import { Button } from "@relume_io/relume-ui";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

const useRelume = () => {
  const transformRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: transformRef });
  const animatedScrollYProgress = useSpring(scrollYProgress, { bounce: 0 });
  const yFirst = useTransform(
    animatedScrollYProgress,
    [0, 1],
    ["0vh", "-87.5vh"],
  );
  const ySecond = useTransform(
    animatedScrollYProgress,
    [0, 1],
    ["0vh", "-39.6vh"],
  );

  return {
    transformRef,
    yFirst,
    ySecond,
  };
};

export function Header80() {
  const useActive = useRelume();
  return (
    <section
      id="relume"
      ref={useActive.transformRef}
      className="relative h-[150vh] px-[5%] md:h-[300vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute bottom-0 left-0 right-auto top-0 z-10">
          <motion.div
            className="flex flex-col gap-[26vw] pt-[70vh]"
            style={{ y: useActive.yFirst }}
          >
            <div className="relative h-[35vw] pt-[120%] sm:h-auto w-[30vw] md:w-[28vw] lg:w-[22vw]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="absolute inset-0 size-full object-cover"
                alt="Relume placeholder image 1"
              />
            </div>
            <div className="relative h-[35vw] pt-[120%] sm:h-auto left-[52vw] mt-[-46vw] w-[30vw] md:w-[28vw] lg:left-[58vw] lg:w-[22vw]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="absolute inset-0 size-full object-cover"
                alt="Relume placeholder image 2"
              />
            </div>
            <div className="relative h-[35vw] pt-[120%] sm:h-auto left-[4vw] mt-[-5vw] w-[28vw] md:w-[26vw] lg:w-[20vw]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="absolute inset-0 size-full object-cover"
                alt="Relume placeholder image 3"
              />
            </div>
            <div className="relative h-[35vw] pt-[120%] sm:h-auto left-[64vw] mt-[-45vw] w-[26vw] md:w-[24vw] lg:w-[18vw]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="absolute inset-0 size-full object-cover"
                alt="Relume placeholder image 4"
              />
            </div>
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-0 left-auto right-0 top-0 z-0"
          style={{ y: useActive.ySecond }}
        >
          <div className="flex flex-col gap-[26vw] pt-[70vh]">
            <div className="relative h-[35vw] pt-[120%] opacity-75 sm:h-auto w-[28vw] md:w-[26vw] lg:w-[20vw]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="absolute inset-0 size-full object-cover"
                alt="Relume placeholder image 5"
              />
            </div>
            <div className="relative h-[35vw] pt-[120%] opacity-75 sm:h-auto right-[50vw] mt-[-44vw] w-[26vw] md:w-[24vw] lg:right-[54vw] lg:w-[18vw]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="absolute inset-0 size-full object-cover"
                alt="Relume placeholder image 6"
              />
            </div>
          </div>
        </motion.div>
        <div className="container relative flex h-full max-w-lg items-center pb-24 pt-16 text-center md:pt-24 lg:py-28">
          <div>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              Simplify restaurant ordering with one quick scan
            </h1>
            <p className="relative z-20 md:text-md">
              Skip the wait and order directly from your table. Our QR system
              lets you browse menus, customize orders, and pay seamlessly
              without flagging down a server.
            </p>
            <div className="relative z-20 mt-6 flex items-center justify-center gap-x-4 md:mt-8">
              <Button title="Get started">Get started</Button>
              <Button title="Learn more" variant="secondary">
                Learn more
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 mt-[35rem] md:mt-[100vh]" />
      </div>
    </section>
  );
}

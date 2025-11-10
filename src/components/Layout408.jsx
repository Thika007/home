"use client";

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useMemo, useRef } from "react";
import { RxChevronRight } from "react-icons/rx";

const SECTION_CONTENT = [
  {
    tag: "Mobile",
    heading: "Mobile-friendly design for any device",
    body: "Responsive interface works perfectly on smartphones, tablets, and desktops for seamless ordering.",
    imageAlt: "Guest scanning a QR code on a phone",
    imageSrc: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    primaryCta: "View details",
    secondaryCta: "Learn more",
  },
  {
    tag: "Operations",
    heading: "Sync orders directly with the kitchen",
    body: "Reduce manual entry and errors with real-time order routing to POS and kitchen display systems.",
    imageAlt: "Kitchen staff preparing dishes",
    imageSrc: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    primaryCta: "See integrations",
    secondaryCta: "Learn more",
  },
  {
    tag: "Insights",
    heading: "Unlock data-driven menu decisions",
    body: "Monitor top-selling items, peak hours, and guest behaviour to optimise your menu and staffing.",
    imageAlt: "Analytics dashboard on a tablet",
    imageSrc: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    primaryCta: "View analytics",
    secondaryCta: "Learn more",
  },
];

const useRelume = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const calculateScale = (index, totalSections) => {
    const sectionFraction = 1 / totalSections;
    const start = sectionFraction * index;
    const end = sectionFraction * (index + 1);
    return useTransform(scrollYProgress, [start, end], [1, 0.9]);
  };

  return { containerRef, calculateScale };
};

const useViewportFlags = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isLargeViewport = useMediaQuery("(min-width: 768px)");
  return useMemo(() => ({ isMobile, isLargeViewport }), [isMobile, isLargeViewport]);
};

const SectionCard = ({ tag, heading, body, imageSrc, imageAlt, primaryCta, secondaryCta }) => (
  <div className="grid grid-cols-1 overflow-hidden border border-border-primary bg-background-primary md:grid-cols-2">
    <div className="order-first flex flex-col justify-center p-6 md:p-8 lg:p-12">
      <p className="mb-2 font-semibold">{tag}</p>
      <h2 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
        {heading}
      </h2>
      <p>{body}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
        <Button title={primaryCta} variant="secondary">
          {primaryCta}
        </Button>
        <Button
          title={secondaryCta}
          variant="link"
          size="link"
          iconRight={<RxChevronRight />}
        >
          {secondaryCta}
        </Button>
      </div>
    </div>
    <div className="order-last flex items-center justify-center bg-background-secondary md:order-last">
      <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
    </div>
  </div>
);

export function Layout408() {
  const { isMobile, isLargeViewport } = useViewportFlags();
  const scrollHelpers = useRelume();
  const totalSections = SECTION_CONTENT.length;

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-2xl text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Advanced</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Designed for modern restaurants
          </h2>
          <p className="md:text-md">
            Powerful platform built to enhance dining experiences across different restaurant
            types and sizes.
          </p>
        </div>
        <div
          ref={scrollHelpers.containerRef}
          className="grid grid-cols-1 gap-6 md:gap-10"
        >
          {SECTION_CONTENT.map((section, index) => {
            if (isMobile || !isLargeViewport) {
              return (
                <SectionCard
                  key={section.heading}
                  {...section}
                />
              );
            }

            return (
              <motion.div
                key={section.heading}
                className="sticky top-[10vh] md:h-[80vh]"
                style={{
                  scale: scrollHelpers.calculateScale(index, totalSections),
                }}
              >
                <SectionCard {...section} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

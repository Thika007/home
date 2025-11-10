"use client";

import { Button } from "@relume_io/relume-ui";
import { motion } from "framer-motion";
import React from "react";

export function Cta57() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto w-full max-w-lg text-center">
          <h1>
            <motion.span
              initial={{ x: "-50%" }}
              animate={{ x: "0%" }}
              transition={{ type: "spring", bounce: 0 }}
              className="block text-6xl font-bold md:text-9xl lg:text-10xl"
            >
              Ready to transform your restaurant
            </motion.span>
          </h1>
          <h1>
            <motion.span
              initial={{ x: "50%" }}
              animate={{ x: "0%" }}
              transition={{ type: "spring", bounce: 0 }}
              className="mb-5 block text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl"
            >
              Your restaurant revolution starts here
            </motion.span>
          </h1>
          <p className="md:text-md">
            Experience the future of dining with a platform that simplifies
            ordering and maximizes restaurant efficiency.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
            <Button title="Start now">Start now</Button>
            <Button title="Contact sales" variant="secondary">
              Contact sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

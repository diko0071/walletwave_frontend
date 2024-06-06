'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const News = () => {

  return (
    <section id="newsletter" className="flex flex-col items-center justify-center text-center px-4 md:px-6 py-12 md:py-24">

      <div className="container py-24 sm:py-32 mx-auto">
        <h3 className="text-4xl md:text-5xl font-bold">
          Join Our Daily{" "}
          <span className="">
            Newsletter
          </span>
        </h3>
        <p className="text-xl text-muted-foreground mt-4 mb-8">
          Lorem ipsum dolor sit amet consectetur.
        </p>
      </div>
    </section>
  );
};
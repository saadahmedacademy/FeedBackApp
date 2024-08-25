"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import messages from "@/messages.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); 

    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center space-y-6  p-5 lg:p-24 overflow-hidden">
        <section className="flex flex-col sm:mt-16 lg:mt-0 mt-11 md:px-4 items-center justify-center gap-3 text-white w-full">
          <div className="flex justify-center flex-wrap gap-3">
            <h1 className="text-2xl md:text-5xl font-bold text-center">
              Welcome In The World
            </h1>
            <h1 className="text-2xl md:text-5xl font-bold text-center">
              {" "}
              Of Mystry Messages{" "}
            </h1>
          </div>
          <p className="text-lg md:text-2xl text-center w-full">
            Enjoy the interesting messages
          </p>
        </section>
        <section className="container">
          <Carousel>
            <CarouselContent>
              {messages.map((msg, index) => (
                <CarouselItem
                  key={index}
                  className={`transition-transform duration-500 ease-in-out transform ${
                    index === currentIndex ? "translate-x-0" : "-translate-x-full"
                  }`}
                  style={{ display: index === currentIndex ? "block" : "none" }}
                >
                  <Card className="bg-gray-900 text-white flex flex-col items-center ">
                    <div>
                      <CardHeader>
                        <CardTitle>{msg.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{msg.content}</p>
                        <p className="text-gray-400 text-sm">{msg.received}</p>
                      </CardContent>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
       
          </Carousel>
        </section>
      </main>
    </>
  );
}

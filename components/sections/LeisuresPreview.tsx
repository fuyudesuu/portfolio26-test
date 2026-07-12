"use client";

import { Kicker } from "@/components/ui";
import HobbiesPreview from "./HobbiesPreview";
import EventsPreview from "./EventsPreview";
import type { ComponentProps } from "react";

type LeisuresProps = {
  hobbies: ComponentProps<typeof HobbiesPreview>["hobbies"];
  events: ComponentProps<typeof EventsPreview>["events"];
};

export default function LeisuresPreview({ hobbies, events }: LeisuresProps) {
  return (
    <section id="leisures" className="px-5 pb-[108px] pt-[120px]">
      <div className="mx-auto w-full max-w-[1080px] px-0 sm:px-2">
        <Kicker index="03" label="Leisures" jp="趣味" title="Beyond the desk" />
        <div className="grid grid-cols-1 items-start gap-11 min-[880px]:grid-cols-[7fr_5fr]">
          <HobbiesPreview hobbies={hobbies} />
          <EventsPreview events={events} />
        </div>
      </div>
    </section>
  );
}

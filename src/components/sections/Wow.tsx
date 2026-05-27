"use client";

import Image from "next/image";
import CinematicSurface from "@/components/CinematicSurface";
import { media } from "@/lib/media";

/** Portrait aspect — caps width on wide viewports so cover does not crop the face. */
const WOW_MAX_W = `calc(100svh * ${media.wow.width} / ${media.wow.height})`;

export default function Wow() {
  return (
    <CinematicSurface
      id="wow"
      intenseGrain
      className="cinematic-section--hero h-screen w-full"
      contentClassName="relative h-full min-h-screen"
    >
      <div className="absolute inset-0 flex justify-center">
        <div className="relative h-full w-full" style={{ maxWidth: WOW_MAX_W }}>
          <Image
            src={media.wow.src}
            alt=""
            fill
            loading="lazy"
            className="object-cover object-[50%_32%] grayscale opacity-90 md:object-center"
            sizes="(max-width: 768px) 100vw, 56vh"
          />
        </div>
      </div>
    </CinematicSurface>
  );
}

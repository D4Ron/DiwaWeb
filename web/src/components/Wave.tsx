/**
 * The section separator from the earlier Diwa site, rebuilt.
 *
 * Two stacked paths per edge. The back layer is translucent and runs on a
 * 14s period, the front layer is solid and runs on 11s, so the two never
 * resynchronise and the shape never appears to repeat. Amplitude is larger
 * than a pure breathe — it should be visible — but the period is long
 * enough that it stays behind the text rather than competing with it.
 *
 * `fill` is the colour of the section the wave is cutting *into*, i.e. the
 * ground on the far side of the edge.
 */

type Props = {
  /** Colour of the adjacent section — what the wave carves out of the band. */
  fill: string;
  position: "top" | "bottom";
  className?: string;
};

const TOP_BACK =
  "M0,0 L1200,0 L1200,44 C1020,86 880,20 700,44 C520,68 340,96 180,66 C110,53 50,44 0,50 Z";
const TOP_FRONT =
  "M0,0 L1200,0 L1200,30 C1030,72 860,10 690,34 C520,58 330,84 170,54 C105,42 48,34 0,40 Z";
const BOT_BACK =
  "M0,100 L1200,100 L1200,54 C1030,14 850,80 680,58 C510,36 320,8 160,40 C100,52 46,60 0,54 Z";
const BOT_FRONT =
  "M0,100 L1200,100 L1200,68 C1040,28 850,92 680,70 C510,48 330,22 170,52 C108,64 50,72 0,66 Z";

export function Wave({ fill, position, className = "" }: Props) {
  const back = position === "top" ? TOP_BACK : BOT_BACK;
  const front = position === "top" ? TOP_FRONT : BOT_FRONT;

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute left-[-8%] z-10 h-[70px] w-[116%] sm:h-[100px]",
        position === "top" ? "top-[-1px]" : "bottom-[-1px]",
        className,
      ].join(" ")}
    >
      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <path
          d={back}
          fill={fill}
          opacity={0.42}
          className="animate-wave-b origin-center"
        />
        <path d={front} fill={fill} className="animate-wave-a origin-center" />
      </svg>
    </div>
  );
}

/**
 * A full indigo band with a wave cut into both edges — the device from the
 * earlier site. Children are centred inside it.
 */
export function WaveBand({
  children,
  adjacent = "var(--color-mint)",
  className = "",
}: {
  children: React.ReactNode;
  /** Ground colour of the sections above and below. */
  adjacent?: string;
  className?: string;
}) {
  return (
    <section
      className={`bg-indigo relative overflow-hidden px-6 py-28 text-white sm:py-32 ${className}`}
    >
      <Wave fill={adjacent} position="top" />
      <div className="relative z-20 mx-auto max-w-[900px] text-center">
        {children}
      </div>
      <Wave fill={adjacent} position="bottom" />
    </section>
  );
}

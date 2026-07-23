// Grid tuning knobs — raise the alpha to make the lines more visible,
// lower it to fade them further into the background.
const GRID_LINE = 'rgba(10, 10, 10, 0.04)'
const GRID_CELL = '96px 64px'

export const Background = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full bg-white"
      style={{
        // Whole-pixel cells and a 1px hard stop: rem-sized cells land the lines
        // on fractional device pixels, which is what makes the grid look stitched.
        backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
        backgroundSize: GRID_CELL,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#ffffff,transparent)]"></div>
    </div>
  );
};

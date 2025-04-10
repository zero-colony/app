import blockies from "blockies";

export const generateBlockie = (id: number) => {
  const [color, bgcolor, spotcolor, seedSalt] = ["#b243a6", "#fe5161", "#3f4057", "^&"];
  return blockies({
    // All options are optional
    seed: id.toString() + seedSalt, // seed used to generate icon data, default: random
    color, // to manually specify the icon color, default: random
    bgcolor, // choose a different background color, default: random
    size: 10, // width/height of the icon in blocks, default: 8
    scale: 14, // width/height of each block in pixels, default: 4
    spotcolor, // each pixel has a 13% chance of being of a third color,
    // default: random. Set to -1 to disable it. These "spots" create structures
    // that look like eyes, mouths and noses.
  });
};

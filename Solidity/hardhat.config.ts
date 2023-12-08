import { HardhatUserConfig } from "hardhat/config";
import fs from "fs";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
import "hardhat-preprocessor";

function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean) // remove empty lines
    .map((line: string) => line.trim().split("="));
}

const config: HardhatUserConfig = {
  preprocess: {
    eachLine: (hre) => ({
      transform: (line: string) => {
        if (line.match(/".*.sol";$/)) { // match all lines with `"<any-import-path>.sol";`
          for (const [from, to] of getRemappings()) {
            if (line.includes(from)) {
              line = line.replace(from, to);
              break;
            }
          }
        }
        return line;
      },
    }),
  },
  solidity: "0.8.19",
};

export default config;

import fs from "fs";
import { resolve } from "path";
import Ajv2020 from "ajv/dist/2020"
import { getCyclesJson, getFactionsJson, getPacksJson } from "../../src/index";

const ajv = new Ajv2020({ strict: true, allErrors: true });

// Sides

// Factions
const faction_schema_path = resolve(__dirname, "../../schema/v1", "faction_schema.json");
const faction_schema = JSON.parse(fs.readFileSync(faction_schema_path, "utf-8"));
export const validateFactionsSchema: any = ajv.compile(faction_schema);
const factions = getFactionsJson();
if (!validateFactionsSchema(factions)) {
  console.log(validateFactionsSchema.errors);
  process.exit(1);
}


// Cycles
const cycle_schema_path = resolve(__dirname, "../../schema/v1", "cycle_schema.json");
const cycle_schema = JSON.parse(fs.readFileSync(cycle_schema_path, "utf-8"));
export const validateCyclesSchema: any = ajv.compile(cycle_schema);
const cycles = getCyclesJson();
if (!validateCyclesSchema(cycles)) {
  console.log(validateCyclesSchema.errors);
  process.exit(1);
}

// Packs
const pack_schema_path = resolve(__dirname, "../../schema/v1", "pack_schema.json");
const pack_schema = JSON.parse(fs.readFileSync(pack_schema_path, "utf-8"));
export const validatePacksSchema: any = ajv.compile(pack_schema);
const packs = getPacksJson();
if (!validatePacksSchema(packs)) {
  console.log(validatePacksSchema.errors);
  process.exit(1);
}

let cycleCodes = new Set<string>();
cycles.forEach(function(cycle) {
  cycleCodes.add(cycle.code);
});

function isValidCycleCode(packCycleCode, cycleCodes) {
  return cycleCodes.has(packCycleCode);
}

// use .every with a function to check for missing cycle codes.
let numBadPackCycleCodes = 0;
packs.forEach(function(pack) {
  if (!isValidCycleCode(pack.cycle_code, cycleCodes)) {
    console.log(`FAIL "${pack.cycle_code}" is not a valid cycle code.`);
    numBadPackCycleCodes++;
  }
});

if (numBadPackCycleCodes) {
  process.exit(1);
}


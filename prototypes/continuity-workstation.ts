import { buildContinuityWorkstationReport } from "../src/index.js";

const report = buildContinuityWorkstationReport();

console.log(JSON.stringify(report.summary, null, 2));

import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { query } from "../db/snowflake.js";

export async function uploadImageToSnowflake(file) {
    const tempPath = path.join("temp", uuidv4() + ".jpg");

    // ensure temp folder exists
    await fs.ensureDir("temp");

    // write buffer to temp file
    await fs.writeFile(tempPath, file.buffer);

    const filename = path.basename(tempPath);

    // upload into Snowflake stage
    await query(`
        PUT file://${process.cwd()}/${tempPath}
        @plant_images
        AUTO_COMPRESS=FALSE
        OVERWRITE=TRUE;
    `);

    // remove temp file
    await fs.remove(tempPath);

    return filename;
}

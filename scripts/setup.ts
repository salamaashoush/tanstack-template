import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { cp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Path to the .env file
const ENV_FILE = join(process.cwd(), ".env");
const ENV_EXAMPLE_FILE = join(process.cwd(), ".env.example");
function generateSecret() {
  return randomBytes(32).toString("base64");
}

async function updateAuthSecret() {
  // Generate a new secret
  const NEW_SECRET = generateSecret();

  // Read the existing .env file
  try {
    const data = await readFile(ENV_FILE, "utf8");
    // Split data into lines
    const lines = data.split("\n");

    // Find the index of the line containing VITE_SESSION_SECRET, if it exists
    const index = lines.findIndex((line) =>
      line.startsWith("VITE_SESSION_SECRET"),
    );
    const secretLine = `VITE_SESSION_SECRET='${NEW_SECRET}'`;

    if (index !== -1) {
      // check if existing value not empty
      const isSet = lines[index].split("=")[1].length > 2;
      if (isSet) {
        console.log("VITE_SESSION_SECRET already set!");
        return;
      }
      // Replace the existing line
      lines[index] = secretLine;
    } else {
      // Append new VITE_SESSION_SECRET if not found
      lines.push(secretLine);
    }

    // Join the lines back into a single string
    const updatedData = lines.join("\n");

    // Write the updated data back to the .env file
    await writeFile(ENV_FILE, updatedData, "utf8");
    console.log("Updated VITE_SESSION_SECRET in .env file.");
  } catch (err) {
    console.error("Error reading .env file:", err);
    return;
  }
}

async function main() {
  // copy .env.example to .env
  if (!existsSync(ENV_FILE)) {
    await cp(ENV_EXAMPLE_FILE, ENV_FILE);
    console.log("Copied .env.example to .env");
  }
  // Update the VITE_SESSION_SECRET in the .env file
  await updateAuthSecret();
}

await main()
  .catch((err: unknown) => {
    console.error(err);
  })
  .then(() => process.exit(0));

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "../lib/mongoose.js";
import Book from "../Models/Books-model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Resolve JSON path at repo root: ../../BookStore.books.json
  const jsonPath = path.resolve(__dirname, "..", "..", "BookStore.books.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("Seed file not found:", jsonPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse JSON:", err.message);
    process.exit(1);
  }

  if (!Array.isArray(data)) {
    console.error("Seed JSON must be an array of books");
    process.exit(1);
  }

  // Connect Mongo
  const { default: mongooseInstance, connectMongo } = await import(
    "../lib/mongoose.js"
  );
  await connectMongo();

  const ops = [];
  for (const item of data) {
    // Normalize potential _id from {$oid: "..."}
    let _id = undefined;
    if (item && item._id && item._id.$oid) {
      try {
        _id = new mongooseInstance.Types.ObjectId(item._id.$oid);
      } catch (_) {
        // ignore invalid ids
      }
    }

    // Normalize image path to start with '/'
    let image = item.image || "";
    if (image && !/^https?:/i.test(image)) {
      image = image.startsWith("/") ? image : `/${image}`;
    }

    const doc = {
      name: item.name,
      price: Number(item.price) || 0,
      category: item.category || "General",
      image,
      title: item.title || "",
      description: item.description || "",
    };

    // Upsert by name+title to avoid duplicates on re-run
    const filter = { name: doc.name, title: doc.title };
    const update = { $set: doc };
    const setOnInsert = _id ? { _id } : {};
    ops.push({
      updateOne: {
        filter,
        update: { ...update, $setOnInsert: setOnInsert },
        upsert: true,
      },
    });
  }

  if (ops.length === 0) {
    console.log("No books to seed.");
    process.exit(0);
  }

  const res = await Book.bulkWrite(ops, { ordered: false });
  console.log("Seed complete:", JSON.stringify(res, null, 2));
  await mongooseInstance.connection.close();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

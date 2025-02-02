import { unlink } from "node:fs";
import path from "path";

const STORAGE_DIR = path.join(__dirname, "../../static/storage");

const writeFile = async (file: File) => {
  const { name, type, size } = file;
  const ext = name.split(".").at(-1)!;
  const filename = [new Date().toISOString().replace(/[-:.TZ]/g, ""), ext].join(
    ".",
  );
  const _path = path.join(STORAGE_DIR, filename);
  const hasher = new Bun.CryptoHasher("md5");

  const checksum = hasher.update(file).digest("hex");

  await Bun.write(_path, file);

  const url = "/" + _path.split("/").slice(-3).join("/");

  return {
    mimeType: type,
    path: _path,
    name,
    checksum,
    size,
    url,
  };
};

const deleteFile = (path: string): void => {
  unlink(path, (error) => {
    throw error;
  });
};

export { writeFile, deleteFile };

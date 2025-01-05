import { z } from "zod";
import { validateFileType, type FileType } from "./mime-types";
import { formatByteSize } from "./byte-size";

type FileUploadOptions = {
  maxByteSize?: number;
  fileTypes?: FileType[];
};

export const fileUpload = (options: FileUploadOptions = {}) => {
  const { fileTypes = [".jpeg"], maxByteSize = 1024 * 1024 } = options;
  return z
    .instanceof(File)
    .refine((file) => validateFileType(file, fileTypes), {
      message: `Invalid file type, only accept: ${fileTypes.join(", ")}`,
    })
    .refine((file) => file.size <= maxByteSize, {
      message: `File size should not exceed ${formatByteSize(maxByteSize)}`,
    });
};

const unitSize = {
  B: 1,
  KB: 1024,
  MB: 1_048_576,
  GB: 1_073_741_824,
};

export const toByte = (size: number, unit: keyof typeof unitSize): number => {
  return size * unitSize[unit];
};

export function formatByteSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const units: readonly string[] = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB",
    "EB",
  ];
  const factor = 1024;
  const index = Math.floor(Math.log(bytes) / Math.log(factor));

  const size = bytes / Math.pow(factor, index);
  return `${size.toFixed(decimals)} ${units[index]}`;
}

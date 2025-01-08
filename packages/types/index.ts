export type Detection = {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  class: number;
  name: string;
};

export type ResponseError<TCause = unknown> = {
  success: false;
  error: {
    message: string;
    stack?: string;
    cause?: TCause;
  };
};

import { TSource } from "@/lib/types";
import { FC } from "react";

type UpdateSourceProps = Pick<TSource, "_id" | "name" | "budget" | "type"> & { onSuccess: () => void };

export const UpdateSource: FC<UpdateSourceProps> = () => {
  return <></>;
};

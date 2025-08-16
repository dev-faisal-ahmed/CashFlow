import { TRecord } from "../types";

export class QueryHelper {
  static selectFields(fields = "", allowedFields: string[]) {
    if (!fields) return null;

    const requestedFields = fields.split(",").map((f) => f.trim());
    const safeFields = requestedFields.filter((f) => allowedFields.includes(f));

    return safeFields.reduce((acc: TRecord<number>, value) => {
      acc[value.trim()] = 1;
      return acc;
    }, {});
  }
}

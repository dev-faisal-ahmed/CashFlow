import z from "zod";

const baseQuery = z.object({
  search: z.string().optional(),
});

const pagination = z.object({
  page: z.coerce.number().optional().catch(1),
  limit: z.coerce.number().optional().catch(10),
  getAll: z.coerce.boolean().optional().catch(false),
});

const queryWithPagination = baseQuery.and(pagination);

export const commonValidation = { pagination, queryWithPagination, baseQuery };

import z from "zod";

const query = z.object({
  search: z.string().optional(),
  fields: z.string().optional(),
});

const pagination = z.object({
  page: z.coerce.number().optional().catch(1),
  limit: z.coerce.number().optional().catch(10),
  getAll: z.coerce.boolean().optional().catch(false),
});

const queryWithPagination = query.and(pagination);

export const commonValidation = { pagination, query, queryWithPagination };

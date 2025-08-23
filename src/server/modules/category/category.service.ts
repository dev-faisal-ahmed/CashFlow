import { db } from "@/server/db";
import { WithUserId } from "@/server/types";
import { categoryTable, transactionTable } from "@/server/db/schema";
import { GetCategoriesArgs } from "./category.validation";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { AppError } from "@/server/core/app.error";

type TCategory = typeof categoryTable.$inferSelect;

type CreateCategory = typeof categoryTable.$inferInsert;
type GetCategories = WithUserId<{ query: GetCategoriesArgs }>;
type UpdateCategory = WithUserId<{ id: number; dto: Partial<TCategory> }>;
type DeleteCategory = WithUserId<{ id: number }>;
type IsOwner = WithUserId<{ id: number }>;

export class CategoryService {
  static async createCategory(dto: CreateCategory) {
    return db.insert(categoryTable).values(dto);
  }

  static async getCategories({ query, userId }: GetCategories) {
    const { type, page, search } = query;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);
    const { skip, limit } = paginationHelper.getPaginationInfo();

    const whereQuery = and(
      eq(categoryTable.userId, userId),
      ...(type ? [eq(categoryTable.type, type)] : []),
      ...(search ? [ilike(categoryTable.name, `%${search}%`)] : []),
    );

    const startDateSql = sql`
      CASE
        WHEN ${categoryTable.budget}->>'interval' = 'weekly' THEN
          date_trunc('week', now())
        WHEN ${categoryTable.budget}->>'interval' = 'monthly' THEN
          date_trunc('month', now())
        WHEN ${categoryTable.budget}->>'interval' = 'yearly' THEN
          date_trunc('year', now())
        ELSE NULL
      END
    `;

    const categories = await db
      .select({
        id: categoryTable.id,
        name: categoryTable.name,
        type: categoryTable.type,
        budget: categoryTable.budget,
        income: sql<number>`
          SUM(
            CASE
              WHEN ${transactionTable.type} = 'income'
                AND ${startDateSql} IS NOT NULL
                AND ${transactionTable.date} >= ${startDateSql}
                AND ${transactionTable.date} <= now()
              THEN ${transactionTable.amount}
              ELSE 0
            END
          )
        `,
        expense: sql<number>`
          SUM(
            CASE
              WHEN ${transactionTable.type} = 'expense'
                AND ${startDateSql} IS NOT NULL
                AND ${transactionTable.date} >= ${startDateSql}
                AND ${transactionTable.date} <= now()
              THEN ${transactionTable.amount}
              ELSE 0
            END
          )
        `,
      })
      .from(categoryTable)
      .leftJoin(transactionTable, eq(transactionTable.categoryId, categoryTable.id))
      .where(whereQuery)
      .groupBy(categoryTable.id)
      .orderBy(desc(categoryTable.createdAt))
      .limit(limit)
      .offset(skip);

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(${categoryTable.id})` })
      .from(categoryTable)
      .where(whereQuery);

    const meta = paginationHelper.getMeta(count);
    return { categories, meta };
  }

  static async getCategoryList(usrId: number) {
    return db
      .select({ id: categoryTable.id, name: categoryTable.name, type: categoryTable.type })
      .from(categoryTable)
      .where(eq(categoryTable.userId, usrId));
  }

  static async updateCategory({ id, dto, userId }: UpdateCategory) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to update this category", 401);
    return db.update(categoryTable).set(dto).where(eq(categoryTable.id, id));
  }

  static async deleteCategory({ id, userId }: DeleteCategory) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to delete this category", 401);
    return db.update(categoryTable).set({ isDeleted: true }).where(eq(categoryTable.id, id));
  }

  static async isOwner({ id, userId }: IsOwner) {
    const [category] = await db.select({ userId: categoryTable.userId }).from(categoryTable).where(eq(categoryTable.id, id)).limit(1);
    if (!category) throw new AppError("Category not found!", 404);
    return category.userId === userId;
  }
}

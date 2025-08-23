import { db } from "@/server/db";
import { contactTable, ETransactionType, transactionTable } from "@/server/db/schema";
import { and, asc, eq, ilike, or, sql } from "drizzle-orm";

import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { GetContactsArgs } from "./contact.validation";
import { AppError } from "@/server/core/app.error";
import { IsOwner, WithUserId } from "@/server/types";

// types
type TContact = typeof contactTable.$inferSelect;
type CreateContact = typeof contactTable.$inferInsert;
type GetContacts = WithUserId<{ query: GetContactsArgs }>;
type UpdateContact = WithUserId<{ id: number; dto: Partial<TContact> }>;
type DeleteContact = WithUserId<{ id: number }>;

export class ContactService {
  static async createContact(dto: CreateContact) {
    return db.insert(contactTable).values(dto);
  }

  static async getContacts({ query, userId }: GetContacts) {
    const { search, page } = query;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);
    const { skip, limit } = paginationHelper.getPaginationInfo();

    const whereQuery = and(
      eq(contactTable.userId, userId),
      ...(search ? [or(ilike(contactTable.name, `%${search}%`), ilike(contactTable.phone, `%${search}%`))] : []),
    );

    const contacts = await db
      .select({
        id: contactTable.id,
        name: contactTable.name,
        phone: contactTable.phone,
        address: contactTable.address,
        totalBorrowed: sql<number>`COALESCE(SUM(CASE WHEN ${transactionTable.type} = '${ETransactionType.borrow}' THEN ${transactionTable.amount} ELSE 0 END), 0)`,
        totalLent: sql<number>`COALESCE(SUM(CASE WHEN ${transactionTable.type} = '${ETransactionType.lend}' THEN ${transactionTable.amount} ELSE 0 END), 0)`,
      })
      .from(contactTable)
      .leftJoin(transactionTable, eq(transactionTable.contactId, contactTable.id))
      .where(whereQuery)
      .groupBy(contactTable.id)
      .orderBy(asc(contactTable.name))
      .limit(limit)
      .offset(skip);

    // pagination

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(${contactTable.id})` })
      .from(contactTable)
      .where(whereQuery);

    const meta = paginationHelper.getMeta(count);
    return { contacts, meta };
  }

  static async updateContact({ id, dto, userId }: UpdateContact) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to update this contact", 401);
    return db.update(contactTable).set(dto).where(eq(contactTable.id, id));
  }

  static async deleteContact({ id, userId }: DeleteContact) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to delete this contact", 401);
    return db.update(contactTable).set({ isDeleted: true }).where(eq(contactTable.id, id));
  }

  // helper
  static async isOwner({ id, userId }: IsOwner) {
    const [contact] = await db.select({ userId: contactTable.userId }).from(contactTable).where(eq(contactTable.id, id)).limit(1);
    if (!contact) throw new AppError("Contact not found!", 404);
    return contact.userId === userId;
  }
}

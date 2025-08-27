import { db } from "@/server/db";
import { contactTable } from "@/server/db/schema";
import { and, asc, count, eq, ilike, or } from "drizzle-orm";

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
      eq(contactTable.isDeleted, false),
      eq(contactTable.userId, userId),
      ...(search ? [or(ilike(contactTable.name, `%${search}%`), ilike(contactTable.phone, `%${search}%`))] : []),
    );

    const contacts = await db
      .select({
        id: contactTable.id,
        name: contactTable.name,
        phone: contactTable.phone,
        address: contactTable.address,
        taken: contactTable.taken,
        given: contactTable.given,
      })
      .from(contactTable)
      .where(whereQuery)
      .orderBy(asc(contactTable.name))
      .limit(limit)
      .offset(skip);

    // pagination

    const [{ count: total }] = await db.select({ count: count() }).from(contactTable).where(whereQuery);

    const meta = paginationHelper.getMeta(total);
    return { contacts, meta };
  }

  static async getAllContacts(userId: number) {
    return db.query.contactTable.findMany({
      where: (c, { eq, and }) => and(eq(c.isDeleted, false), eq(c.userId, userId)),
      columns: { id: true, name: true },
      orderBy: (c, { asc }) => [asc(c.name)],
    });
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

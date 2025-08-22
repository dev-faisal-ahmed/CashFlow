import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { IContact } from "./contact.interface";
import { ContactModel } from "./contact.schema";
import { GetContactsArgs } from "./contact.validation";
import { AppError } from "@/server/core/app.error";
import { WithUserId } from "@/server/types";
import { QueryHelper } from "@/server/helpers/query.helper";
import { Types } from "mongoose";

// types
type CreateContact = Pick<IContact, "name" | "phone" | "address" | "userId">;
type GetContacts = WithUserId<{ query: GetContactsArgs }>;
type UpdateContact = WithUserId<{ id: string; dto: Partial<IContact> }>;
type DeleteContact = WithUserId<{ id: string }>;
type IsOwner = { id: string; userId: Types.ObjectId };

export class ContactService {
  static async createContact(dto: CreateContact) {
    const isContactExists = await ContactModel.findOne({ phone: dto.phone, userId: dto.userId }, { _id: 1 }).lean();
    if (isContactExists) throw new AppError("Contact already exists", 400);
    return ContactModel.create(dto);
  }

  static async getContacts({ query, userId }: GetContacts) {
    const requestedFields = query.fields;
    const { search, page } = query;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);
    const { getAll, skip, limit } = paginationHelper.getPaginationInfo();

    const fields = QueryHelper.selectFields(requestedFields, ["_id", "name", "phone", "address", "userId", "given", "taken"]);

    const dbQuery = {
      userId,
      isDeleted: false,
      ...(search && { name: { $regex: search, $options: "i" }, phone: { $regex: search, $options: "i" } }),
    };

    const [result] = await ContactModel.aggregate([
      { $match: dbQuery },
      ...(fields ? [{ $project: fields }] : []),

      {
        $facet: {
          contacts: [...(!getAll ? [{ $skip: skip }, { $limit: limit }] : [])],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const contacts = result.contacts;
    const total = result.total[0].count;
    const meta = paginationHelper.getMeta(total);

    return { contacts, meta };
  }

  static async updateContact({ id, dto, userId }: UpdateContact) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to update this contact", 401);
    return ContactModel.updateOne({ _id: id }, { $set: dto });
  }

  static async deleteContact({ id, userId }: DeleteContact) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to delete this contact", 401);
    return ContactModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
  }

  // helper
  static async isOwner({ id, userId }: IsOwner) {
    const contact = await ContactModel.findOne({ _id: id }, { _id: 1, userId: 1 }).lean();
    if (!contact) throw new AppError("Contact not found!", 404);
    return contact.userId.equals(userId);
  }
}

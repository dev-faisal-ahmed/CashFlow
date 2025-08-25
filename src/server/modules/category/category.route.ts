import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator, queryValidator } from "@/server/middlewares/validator";
import { Hono } from "hono";
import { categoryValidation } from "./category.validation";
import { CategoryService } from "./category.service";
import { ResponseDto } from "@/server/core/response.dto";

export const categoryRoute = new Hono()
  // Create Category
  .post("/", authGuard, jsonValidator(categoryValidation.createCategory), async (ctx) => {
    const user = ctx.get("user");
    const dto = ctx.req.valid("json");
    await CategoryService.createCategory({ ...dto, userId: user.id });
    return ctx.json(ResponseDto.success("Category created successfully"));
  })

  // Get Categories
  .get("/", authGuard, queryValidator(categoryValidation.getCategories), async (ctx) => {
    const user = ctx.get("user");
    const query = ctx.req.valid("query");
    const categories = await CategoryService.getCategories({ query, userId: user.id });
    return ctx.json(ResponseDto.success({ message: "Categories fetched successfully", data: categories }));
  })

  // Get Category List
  .get("/list", authGuard, async (ctx) => {
    const user = ctx.get("user");
    const categories = await CategoryService.getCategoryList(user.id);
    return ctx.json(ResponseDto.success({ message: "Categories fetched successfully", data: categories }));
  })

  // Update Category
  .patch("/:id", authGuard, jsonValidator(categoryValidation.updateCategory), async (ctx) => {
    const user = ctx.get("user");
    const dto = ctx.req.valid("json");
    const id = ctx.req.param("id");
    await CategoryService.updateCategory({ id: Number(id), dto, userId: user.id });
    return ctx.json(ResponseDto.success("Category updated successfully"));
  })

  // Delete Category
  .delete("/:id", authGuard, async (ctx) => {
    const user = ctx.get("user");
    const id = ctx.req.param("id");
    await CategoryService.deleteCategory({ id: Number(id), userId: user.id });
    return ctx.json(ResponseDto.success("Category deleted successfully"));
  });

export type TCategoryRoute = typeof categoryRoute;

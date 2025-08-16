import { Hono } from "hono";
import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator, queryValidator } from "@/server/middlewares/validator";
import { sourceValidation } from "./source.validation";
import { ResponseDto } from "@/server/core/response.dto";
import { SourceService } from "./source.service";

const sourceService = new SourceService();

export const sourceRoute = new Hono()
  // Create Source
  .post("/", authGuard, jsonValidator(sourceValidation.createSource), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    await sourceService.createSource(dto, user._id);
    return ctx.json(ResponseDto.success("Source created successfully"));
  })

  // Get Sources
  .get("/", authGuard, queryValidator(sourceValidation.getSources), async (ctx) => {
    const query = ctx.req.valid("query");
    const user = ctx.get("user");
    const { sources, meta } = await sourceService.getSources(query, user._id);
    return ctx.json(ResponseDto.success({ message: "Sources fetched successfully", meta, data: sources }));
  })

  // Update Source
  .patch("/:id", authGuard, jsonValidator(sourceValidation.updateSource), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    const id = ctx.req.param("id");
    await sourceService.updateSource(dto, id, user._id);
    return ctx.json(ResponseDto.success("Source updated successfully"));
  });

export type TSourceRoute = typeof sourceRoute;

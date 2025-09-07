import { authGuard } from "@/server/middlewares/auth.guard";
import { Hono } from "hono";
import { AnalyticsService } from "./analytics.service";
import { ResponseDto } from "@/server/core/response.dto";

export const analyticsRoute = new Hono()
  // Get Financial Overview
  .get("/overview", authGuard, async (ctx) => {
    const user = ctx.get("user");
    const result = await AnalyticsService.getFinancialOverview(user.id);
    return ctx.json(ResponseDto.success({ message: "Financial overview fetched successfully", data: result }));
  });

export type TAnalyticsRoute = typeof analyticsRoute;

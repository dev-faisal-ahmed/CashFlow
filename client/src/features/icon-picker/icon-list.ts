"use client";

import * as LucideIcons from "lucide-react";
import { isValidElementType } from "react-is";

export const iconList = Object.entries(LucideIcons)
  .filter(([name, icon]) => /^[A-Z]/.test(name) && isValidElementType(icon))
  .map(([name, icon]) => ({ name, icon }));

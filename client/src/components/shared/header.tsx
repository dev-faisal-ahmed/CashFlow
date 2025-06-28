import { FC } from "react";

type HeaderProps = { title: string };
export const Header: FC<HeaderProps> = ({ title }) => (
  <div className="space-y-1">
    <h1 className="text-lg font-semibold">{title}</h1>
  </div>
);

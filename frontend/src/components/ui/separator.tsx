import { FC } from "react";

export const Separator: FC<{ className?: string }> = ({ className }) => (
  <hr className={`separator ${className}`} />
);
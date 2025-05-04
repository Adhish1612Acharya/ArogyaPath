import { FC, ReactNode } from "react";

export const Dialog: FC<{ open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }> = ({
  open,
  onOpenChange,
  children,
}) => (
  <div className={`dialog ${open ? "open" : ""}`} onClick={() => onOpenChange(!open)}>
    {children}
  </div>
);

export const DialogContent: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className={`dialog-content ${className}`}>{children}</div>
);

export const DialogHeader: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className={`dialog-header ${className}`}>{children}</div>
);

export const DialogTitle: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <h2 className={`dialog-title ${className}`}>{children}</h2>
);

export const DialogTrigger: FC<{ asChild?: boolean; children: ReactNode }> = ({ children }) => <>{children}</>;
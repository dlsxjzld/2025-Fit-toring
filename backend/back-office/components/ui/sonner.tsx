"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
          color: "hsl(var(--foreground))",
        },
        className: "toast",
        descriptionClassName: "toast-description",
        classNames: {
          actionButton: "toast-action-button",
          cancelButton: "toast-cancel-button",
          // 필요시
          toast: "toast",
          title: "toast-title",
          description: "toast-desc",
          closeButton: "toast-close",
        },
      }}
      style={
        {
          "--normal-bg": "hsl(var(--background))",
          "--normal-text": "hsl(var(--foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(var(--background))",
          "--success-text": "hsl(var(--foreground))",
          "--success-border": "hsl(142.1 76.2% 36.3%)",
          "--info-bg": "hsl(var(--background))",
          "--info-text": "hsl(var(--foreground))",
          "--info-border": "hsl(var(--primary))",
          "--warning-bg": "hsl(var(--background))",
          "--warning-text": "hsl(var(--foreground))",
          "--warning-border": "hsl(45.4 93.4% 47.5%)",
          "--error-bg": "hsl(var(--background))",
          "--error-text": "hsl(var(--foreground))",
          "--error-border": "hsl(var(--destructive))",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
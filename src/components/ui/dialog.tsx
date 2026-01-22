import * as React from "react"

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 max-h-[90vh] overflow-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full ${className}`}>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <h2 className={`text-xl font-semibold ${className}`}>
      {children}
    </h2>
  );
};

const DialogDescription = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };

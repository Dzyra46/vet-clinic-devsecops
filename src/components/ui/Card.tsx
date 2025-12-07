import { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ title, children, className = '', ...props }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`} {...props}>
      {title && <h3 className="text-lg font-semibold mb-4 p-6 pb-0">{title}</h3>}
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={`p-6 pb-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
};

export const CardDescription = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>;
};

export const CardContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};
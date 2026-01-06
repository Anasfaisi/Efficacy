export function Card({
    title,
    children,
    className,
}: {
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`${className} bg-white border mb-8 border-gray-300 shadow-sm rounded-xl p-6 space-y-4`}
        >
            {title && (
                <h2 className="text-xl font-semibold text-sky-600">{title}</h2>
            )}
            <div className="mt-3 space-y-4">{children}</div>
        </div>
    );
}

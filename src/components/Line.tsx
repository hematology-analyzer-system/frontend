interface Props {
    width?: string;
}

export default function Line({ width = "50%" }: Props) {
    return (
        <div className="relative inset-0 flex items-center" style={{ width }}>
            <div className="w-full border-b h-px border-text-muted opacity-45"></div>
        </div>
    );
}

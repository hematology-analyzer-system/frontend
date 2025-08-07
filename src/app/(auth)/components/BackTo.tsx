import TurnBackIcon from "@/assets/icons/TurnBack";

interface Props {
    address: string;
    width?: string;
    color?: string;
}

export default function BackTo({ address, width = "24", color = "#4D4D4D" }: Props) {
    return (
        <div className="flex flex-row items-center justify-center gap-1 cursor-pointer hover:underline hover:text-primary">
            <div className="mt-0.5">
                <TurnBackIcon width={width} color={color} />
            </div>

            <p className="text-sm font-normal text-text-secondary dark:text-text-secondary-dark hover:text-primary">
                Back to {address.toLowerCase()}
            </p>
        </div>
    );
}

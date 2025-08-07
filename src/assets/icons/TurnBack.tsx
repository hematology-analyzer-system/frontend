interface Props {
    width?: string;
    color?: string; // thêm thuộc tính màu
}

const TurnBackIcon = ({ width = "24", color = "#292D32" }: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={width}
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M15 19.92L8.47997 13.4C7.70997 12.63 7.70997 11.37 8.47997 10.6L15 4.07996"
                stroke={color}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default TurnBackIcon;

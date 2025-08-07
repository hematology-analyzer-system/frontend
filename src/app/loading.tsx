export default function LoadingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen background-gradient dark:background-gradient-dark">
            <div className="flex items-center justify-center space-x-4">
                {[0, 1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden bg-white h-20 w-5 rounded-full shadow-[15px_15px_20px_rgba(0,0,0,0.1),-15px_-15px_30px_#fff,inset_-5px_-5px_10px_rgba(0,0,255,0.1),inset_5px_5px_10px_rgba(0,0,0,0.1)]`}
                    >
                        <span
                            className={`absolute top-0 left-0 h-5 w-5 rounded-full animate-bounce-delay`}
                            style={{
                                animationDelay: `${-0.5 * index}s`,
                            }}
                        />
                    </div>
                ))}
            </div>
            <p className="mt-4 text-xl font-medium text-gray-600">Loading...</p>

            <style>
                {`
                    @keyframes bounce-delay {
                        0% {
                            transform: translateY(250px);
                            filter: hue-rotate(0deg);
                        }
                        50% {
                            transform: translateY(0);
                        }
                        100% {
                            transform: translateY(250px);
                            filter: hue-rotate(50deg);
                        }
                    }
                    .animate-bounce-delay {
                        box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.3),
                                    0 420px 0 400px #088395,
                                    inset 0 0 0 rgba(0, 0, 0, 0.1);
                        animation: bounce-delay 2.5s ease-in-out infinite;
                    }
                `}
            </style>
        </div>
    );
}
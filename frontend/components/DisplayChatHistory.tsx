import Image from "next/image";

function DisplayChatHistory({ chatHistory }:
    { chatHistory: any }) {
    const renderBotMessageTextInChunks = (text: string) => {
        return text.split('*').map((chunk, i) => {
            return (
                <p key={i}>
                    {chunk}
                </p>
            );
        });
    };

    return (
        <div className="space-y-4 pb-40">
            {chatHistory.map((message: any, index: number) => (
                <div className='flex flex-row gap-6' key={index}>
                    <div
                        key={index}
                        className={`p-3 w-full whitespace-pre-line ${message.role === 'user' ? ' text-white self-end' : 'bg-gray-100 text-black self-start'
                            }`}
                    >
                        {message.role !== 'user' ? (
                            <div>
                                <div className='flex flex-row gap-4'>
                                    <Image
                                        src="/quo_suit.png"
                                        width={1080}
                                        height={1080}
                                        alt="Quo"
                                        className="rounded-full w-16 h-16 object-cover"
                                    />
                                    <h3 className="font-bold text-lg">Quo</h3>
                                </div>
                                <div className="mt-1 space-y-1">{renderBotMessageTextInChunks(message.text)}</div>
                            </div>
                        ) : (
                            <p className='ml-auto w-fit bg-primary rounded-lg p-3'>{message.text}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DisplayChatHistory;
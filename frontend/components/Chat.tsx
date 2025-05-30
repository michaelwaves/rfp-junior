"use client"
import { useState } from 'react';
import { createChat, updateChat } from '@/lib/db/tables';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import DisplayChatHistory from './DisplayChatHistory';
import WelcomeUser from './WelcomeUser';

const Chat = () => {

    const [userInput, setUserInput] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [chatId, setChatId] = useState<string>("")

    const [password, setPassword] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [companyContext, setCompanyContext] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (userInput == '') {
            toast("Please input a question to chat with RFP")
            setLoading(false)
            return
        }

        try {

            // Add user input to chat history
            setChatHistory((prevChatHistory) => [...prevChatHistory, { role: 'user', text: userInput }]);

            const data = { chat_history: chatHistory, sources: [] }
            //add chat to db
            if (chatId == "") {
                const { id } = await createChat(data)
                setChatId(id)
            } else {
                await updateChat(chatId, data)
            }

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userInput, context: rfps, id: chatId, entityType: entityType }),
            });

            if (!res.body) throw new Error('Response body is empty');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let botMessage = '';
            setChatHistory((prevHistory) => [
                ...prevHistory,
                { role: 'model', text: botMessage },
            ]);

            const updateLastMessage = (newText: string) => {
                setChatHistory((prevHistory) => {
                    const updatedHistory = [...prevHistory];
                    updatedHistory[updatedHistory.length - 1].text = newText;
                    return updatedHistory;
                });
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                botMessage += decoder.decode(value, { stream: true });
                updateLastMessage(botMessage);
            }
        } catch (error) {
            console.error('Error while sending message:', error);
            toast.error("Error sending message", { description: JSON.stringify(error) })
        } finally {
            setLoading(false);
            setUserInput('');
        }
    };



    return (
        <div className="p-4 mx-auto">
            {chatHistory.length == 0 && <WelcomeUser />}

            <div className={chatHistory.length > 0 ? 'fixed bottom-0 p-2 w-full' : 'w-[400px] md:w-[800px]'}>
                <div className='w-2/3 mx-auto bg-white flex flex-col gap-2 p-4 shadow-2xl rounded-lg items-center justify-center h-full'>
                    <form onSubmit={handleSubmit} className="w-full mt-4 flex flex-row">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="flex-1 p-2 border rounded-l-lg w-full focus:outline-none"
                            disabled={loading}
                            placeholder='Ask anything FINTRAC related'
                        />
                        <button type="submit" className="p-2 bg-primary text-white rounded-r-lg hover:cursor-pointer hover:shadow-lg" disabled={loading}>
                            {loading ? <Loader className='animate-spin' /> : "Send"}
                        </button>
                    </form>
                </div>
            </div>

            <DisplayChatHistory chatHistory={chatHistory} />

        </div>

    );
};

export default Chat;

'use server';

export async function searchBrowserBase({
    username,
    password,
    query,
    context
}: {
    username: string;
    password: string;
    query: string;
    context: string;
}) {
    try {
        const response = await fetch('http://127.0.0.1:8081/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                query,
                context
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting to browserbase server:', error);
        throw error;
    }
}

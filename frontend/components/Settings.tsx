'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Settings } from 'lucide-react';
import { searchBrowserBase } from '@/lib/browserbase';
import { DataTable } from './table/datatable';

export default function SettingsForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [companyContext, setCompanyContext] = useState('');
    const [query, setQuery] = useState('');

    const [results, setResults] = useState<any>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ username, password, companyContext });
        const res = await searchBrowserBase({ username, password, query, context: companyContext })
        console.log(res)
        setResults(res)
    };

    return (
        <div className='w-full h-full'>
            <div className="max-w-5xl w-full mx-auto mt-10 p-6 bg-sky-50 rounded-2xl shadow-lg border border-sky-100">
                <div className="flex items-center gap-3 mb-6 text-sky-800">
                    <Search className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Search MERX</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-xl font-bold">Login with MERX credentials</h2>
                    <div>
                        <label className="block text-sky-700 font-medium mb-1">Username</label>
                        <Input
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-white border-sky-200 focus-visible:ring-sky-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sky-700 font-medium mb-1">Password</label>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white border-sky-200 focus-visible:ring-sky-400"
                        />
                    </div>
                    <h2 className="text-xl font-bold">Tell us about your company</h2>
                    <div>
                        <label className="block text-sky-700 font-medium mb-1">Company Context</label>
                        <Textarea
                            rows={5}
                            placeholder="Tell us what your company does..."
                            value={companyContext}
                            onChange={(e) => setCompanyContext(e.target.value)}
                            className="bg-white border-sky-200 focus-visible:ring-sky-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sky-700 font-medium mb-1">Query</label>
                        <Input
                            type="query"
                            placeholder="Search MERX"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-white border-sky-200 focus-visible:ring-sky-400"
                        />
                    </div>
                    <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                        Search
                    </Button>
                </form>
            </div>
            {results && <>
                {results.results && <DataTable data={results.results} />}
                {results.recommendation &&
                    <pre className="whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-md text-sm overflow-auto max-w-full">
                        {JSON.stringify(results.recommendation[0].message.content)}
                    </pre>
                }
            </>
            }
        </div>
    );
}

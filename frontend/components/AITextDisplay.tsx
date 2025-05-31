import React from "react";

const rawText = `Based on your company context in Project Advisory and Disputes (PAD), the following three RFPs are the most relevant for your services:

1. **WSD/LWCS Analytical Chemistry Services for Environmental Remediation**
   - **Buyer:** City of Ottawa
   - **Category:** Canadian Public Tenders
   - **Closing Date:** 2025/06/26
   - **Link:** [View RFP](https://www.example.com/private/supplier/interception/open-solicitation/3467420304?target=view)
   - **Relevance:** This project could provide opportunities for advisory roles in managing risks and disputes related to environmental remediation efforts. Analyzing how various actions impact timelines and expenditures will be crucial.

2. **CIB Building Retrofit Initiative – Technical Advisor(s) Engagement**
   - **Buyer:** Canada Infrastructure Bank
   - **Category:** Agencies, Crown & Private Corporations
   - **Closing Date:** 2025/06/25
   - **Link:** [View RFP](https://www.example.com/private/supplier/interception/open-solicitation/3452949068?target=view)
   - **Relevance:** This initiative involves infrastructure projects where your expertise can aid in management practices, risk assessment, and dispute resolution as buildings undergo retrofit processes.

3. **Audit, Compliance & Insurance for Contract Management Activities**
   - **Buyer:** Independent Electricity System Operator
   - **Category:** Canadian Public Tenders
   - **Closing Date:** 2025/06/23
   - **Link:** [View RFP](https://www.example.com/private/supplier/interception/open-solicitation/3452949074?target=view)
   - **Relevance:** Advisory roles in contract management and compliance could provide substantial opportunities for evaluating claims and ensuring project and financial management practices meet industry standards, which ties well with your services.

These RFPs align well with your skills in project management advisory, risk advisory, and dispute support, particularly in a construction and infrastructure context.`;

const parseRfpText = (text: string) => {
    const headerMatch = text.match(/^(.+?)\n\n1\./);
    const footerMatch = text.match(/\n\nThese RFPs align.+$/);

    const header = headerMatch?.[1].trim() ?? "";
    const footer = footerMatch?.[0].trim() ?? "";

    const rfpsRaw = text
        .replace(headerMatch?.[0] || "", "")
        .replace(footerMatch?.[0] || "", "")
        .trim()
        .split(/\n\n(?=\d\.\s)/);

    const rfps = rfpsRaw.map((rfpStr) => {
        const titleMatch = rfpStr.match(/^\d\.\s\*\*(.+?)\*\*/);
        const buyerMatch = rfpStr.match(/\*\*Buyer:\*\*\s(.+)/);
        const categoryMatch = rfpStr.match(/\*\*Category:\*\*\s(.+)/);
        const closingDateMatch = rfpStr.match(/\*\*Closing Date:\*\*\s(.+)/);
        const linkMatch = rfpStr.match(/\[View RFP\]\((.+?)\)/);
        const relevanceMatch = rfpStr.match(/\*\*Relevance:\*\*\s(.+)/);

        return {
            title: titleMatch?.[1],
            buyer: buyerMatch?.[1],
            category: categoryMatch?.[1],
            closingDate: closingDateMatch?.[1],
            link: linkMatch?.[1],
            relevance: relevanceMatch?.[1]?.replace(/\n/g, " "),
        };
    });

    return { header, rfps, footer };
};

const AITextDisplay = ({ text }: { text: string }) => {
    const { header, rfps, footer } = parseRfpText(text);

    return (
        <div className="bg-sky-50 min-h-screen px-4 py-8 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-8">
                <h2 className="text-xl font-medium text-sky-700">{header}</h2>

                {rfps.map((rfp, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-6 rounded-xl shadow border border-sky-100 space-y-2"
                    >
                        <h3 className="text-lg font-semibold text-sky-800">
                            {idx + 1}. {rfp.title}
                        </h3>
                        <p className="text-gray-700">
                            <strong>Buyer:</strong> {rfp.buyer}
                        </p>
                        <p className="text-gray-700">
                            <strong>Category:</strong> {rfp.category}
                        </p>
                        <p className="text-gray-700">
                            <strong>Closing Date:</strong> {rfp.closingDate}
                        </p>
                        <a
                            href={rfp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-800 underline"
                        >
                            View RFP
                        </a>
                        <p className="text-gray-600 italic">{rfp.relevance}</p>
                    </div>
                ))}

                <p className="text-gray-700 text-center pt-4">{footer}</p>
            </div>
        </div>
    );
};

export default AITextDisplay;

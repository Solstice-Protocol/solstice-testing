import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
    return (
        <div className="border-b-2 border-[rgb(66,66,69)] last:border-0">
            <button
                onClick={onClick}
                className="flex items-center justify-between w-full py-6 text-left group"
            >
                <span className="text-[24px] font-semibold text-[#F5F5F7] group-hover:text-[rgba(255,255,255,0.9)] transition-colors">
                    {question}
                </span>
                <ChevronDown
                    className={cn(
                        "w-6 h-6 text-[rgb(110,110,115)] transition-transform duration-300",
                        isOpen && "rotate-180"
                    )}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-out",
                    isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"
                )}
            >
                <p className="text-[18px] text-[rgba(255,255,255,0.8)] leading-relaxed max-w-[83.33%]">
                    {answer}
                </p>
            </div>
        </div>
    );
}

const FAQS = [
    {
        question: "How do I deposit funds?",
        answer: "You can deposit using SOL or any supported SPL token. Simply connect your wallet and click the 'Deposit' button in your profile."
    },
    {
        question: "Are the games fair?",
        answer: "Yes, every game outcome is provably fair. You can verify the randomness of each roll using the client seed and server seed pair provided in the game details."
    },
    {
        question: "What is the minimum bet?",
        answer: "The minimum bet varies by game but typically starts at 0.01 SOL. VIP players may have access to higher limit tables."
    },
    {
        question: "How fast are withdrawals?",
        answer: "Withdrawals are processed instantly on the Solana blockchain. You should receive your funds within seconds of confirming the transaction."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);

    return (
        <section className="w-full py-[160px] px-6 bg-black">
            <div className="max-w-[1024px] mx-auto">
                <h2 className="text-[56px] font-semibold text-[#F5F5F7] mb-[80px]">Common Questions</h2>
                <div className="max-w-[800px]">
                    {FAQS.map((faq, i) => (
                        <AccordionItem
                            key={i}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === i}
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

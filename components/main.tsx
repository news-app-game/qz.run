export default function Main({ children }: { children: React.ReactNode }) {
    return (
        <main className="w-full min-h-[calc(100vh-134px-80px)]">
            {children}
        </main>
    )
}
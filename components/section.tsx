function Section({ children }: { children: React.ReactNode }) {
    return (
        <section className="w-full flex flex-col justify-center items-center gap-8 max-w-[1024px] mx-auto my-20 px-6">
            {children}
        </section>
    )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-3">
            {children}
        </div>
    )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl md:text-3xl font-bold">{children}</h2>
    )
}

function SectionDescription({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-md md:text-lg text-muted-foreground">{children}</p>
    )
}

Section.Title = SectionTitle
Section.Description = SectionDescription
Section.Header = SectionHeader

export { Section, SectionHeader, SectionTitle, SectionDescription }
const stats = [
  { number: "10,000+", label: "Devices Repaired" },
  { number: "4.9/5", label: "Customer Rating" },
  { number: "30+", label: "Locations in Pune" },
  { number: "24/7", label: "Support Available" }
];

export function StatsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
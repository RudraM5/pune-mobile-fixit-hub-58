const processSteps = [
  { step: "1", title: "Book Online", desc: "Select your device and service" },
  { step: "2", title: "Pickup", desc: "We collect your device for free" },
  { step: "3", title: "Repair", desc: "Expert technicians fix your device" },
  { step: "4", title: "Delivery", desc: "Get your repaired device back" }
];

export function ProcessSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple 4-step process to get your device fixed
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {processSteps.map((item, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
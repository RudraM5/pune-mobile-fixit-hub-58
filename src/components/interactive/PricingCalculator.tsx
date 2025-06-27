
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, IndianRupee, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingData {
  [brand: string]: {
    [model: string]: {
      [service: string]: {
        price: number;
        time: string;
      };
    };
  };
}

const pricingData: PricingData = {
  "Apple": {
    "iPhone 15 Pro Max": {
      "Screen Replacement": { price: 2800, time: "2-3 hours" },
      "Battery Replacement": { price: 1400, time: "1-2 hours" },
      "Camera Repair": { price: 2200, time: "2-4 hours" },
      "Charging Port": { price: 1000, time: "1-2 hours" },
      "Speaker Repair": { price: 800, time: "1-2 hours" },
      "Water Damage Treatment": { price: 3500, time: "4-6 hours" },
      "Face ID Repair": { price: 2500, time: "2-3 hours" }
    },
    "iPhone 15 Pro": {
      "Screen Replacement": { price: 2500, time: "2-3 hours" },
      "Battery Replacement": { price: 1200, time: "1-2 hours" },
      "Camera Repair": { price: 1800, time: "2-4 hours" },
      "Charging Port": { price: 800, time: "1-2 hours" },
      "Speaker Repair": { price: 700, time: "1-2 hours" },
      "Water Damage Treatment": { price: 3200, time: "4-6 hours" },
      "Face ID Repair": { price: 2200, time: "2-3 hours" }
    },
    "iPhone 15": {
      "Screen Replacement": { price: 2200, time: "2-3 hours" },
      "Battery Replacement": { price: 1100, time: "1-2 hours" },
      "Camera Repair": { price: 1600, time: "2-4 hours" },
      "Charging Port": { price: 700, time: "1-2 hours" },
      "Speaker Repair": { price: 600, time: "1-2 hours" },
      "Water Damage Treatment": { price: 2800, time: "4-6 hours" },
      "Face ID Repair": { price: 2000, time: "2-3 hours" }
    },
    "iPhone 14 Pro Max": {
      "Screen Replacement": { price: 2400, time: "2-3 hours" },
      "Battery Replacement": { price: 1200, time: "1-2 hours" },
      "Camera Repair": { price: 1800, time: "2-4 hours" },
      "Charging Port": { price: 800, time: "1-2 hours" },
      "Speaker Repair": { price: 700, time: "1-2 hours" },
      "Water Damage Treatment": { price: 3000, time: "4-6 hours" },
      "Face ID Repair": { price: 2200, time: "2-3 hours" }
    },
    "iPhone 14": {
      "Screen Replacement": { price: 2000, time: "2-3 hours" },
      "Battery Replacement": { price: 1000, time: "1-2 hours" },
      "Camera Repair": { price: 1400, time: "2-4 hours" },
      "Charging Port": { price: 600, time: "1-2 hours" },
      "Speaker Repair": { price: 500, time: "1-2 hours" },
      "Water Damage Treatment": { price: 2500, time: "4-6 hours" },
      "Face ID Repair": { price: 1800, time: "2-3 hours" }
    },
    "iPhone 13": {
      "Screen Replacement": { price: 1800, time: "2-3 hours" },
      "Battery Replacement": { price: 900, time: "1-2 hours" },
      "Camera Repair": { price: 1200, time: "2-4 hours" },
      "Charging Port": { price: 500, time: "1-2 hours" },
      "Speaker Repair": { price: 450, time: "1-2 hours" },
      "Water Damage Treatment": { price: 2200, time: "4-6 hours" },
      "Face ID Repair": { price: 1600, time: "2-3 hours" }
    }
  },
  "Samsung": {
    "Galaxy S24 Ultra": {
      "Screen Replacement": { price: 2200, time: "2-3 hours" },
      "Battery Replacement": { price: 1000, time: "1-2 hours" },
      "Camera Repair": { price: 1600, time: "2-4 hours" },
      "Charging Port": { price: 700, time: "1-2 hours" },
      "Speaker Repair": { price: 600, time: "1-2 hours" },
      "Water Damage Treatment": { price: 2800, time: "4-6 hours" },
      "S Pen Repair": { price: 400, time: "30 mins" }
    },
    "Galaxy S24": {
      "Screen Replacement": { price: 2000, time: "2-3 hours" },
      "Battery Replacement": { price: 900, time: "1-2 hours" },
      "Camera Repair": { price: 1400, time: "2-4 hours" },
      "Charging Port": { price: 600, time: "1-2 hours" },
      "Speaker Repair": { price: 550, time: "1-2 hours" },
      "Water Damage Treatment": { price: 2500, time: "4-6 hours" }
    },
    "Galaxy S23 Ultra": {
      "Screen Replacement": { price: 2000, time: "2-3 hours" },
      "Battery Replacement": { price: 900, time: "1-2 hours" },
      "Camera Repair": { price: 1400, time: "2-4 hours" },
      "Charging Port": { price: 600, time: "1-2 hours" },
      "Speaker Repair": { price: 550, time: "1-2 hours" },
      "Water Damage Treatment": { price: 2500, time: "4-6 hours" },
      "S Pen Repair": { price: 350, time: "30 mins" }
    },
    "Galaxy S23": {
      "Screen Replacement": { price: 1800, time: "2-3 hours" },
      "Battery Replacement": { price: 800, time: "1-2 hours" },
      "Camera Repair": { price: 1200, time: "2-4 hours" },
      "Charging Port": { price: 500, time: "1-2 hours" },
      "Speaker Repair": { price: 500, time: "1-2 hours" },
      "Water Damage Treatment": { price: 2200, time: "4-6 hours" }
    },
    "Galaxy A54": {
      "Screen Replacement": { price: 1200, time: "2-3 hours" },
      "Battery Replacement": { price: 600, time: "1-2 hours" },
      "Camera Repair": { price: 800, time: "2-4 hours" },
      "Charging Port": { price: 400, time: "1-2 hours" },
      "Speaker Repair": { price: 350, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1500, time: "4-6 hours" }
    },
    "Galaxy Z Fold 5": {
      "Screen Replacement": { price: 4500, time: "4-5 hours" },
      "Battery Replacement": { price: 1500, time: "2-3 hours" },
      "Camera Repair": { price: 2000, time: "2-4 hours" },
      "Charging Port": { price: 800, time: "1-2 hours" },
      "Speaker Repair": { price: 700, time: "1-2 hours" },
      "Water Damage Treatment": { price: 5000, time: "6-8 hours" },
      "Hinge Repair": { price: 3000, time: "3-4 hours" }
    }
  },
  "OnePlus": {
    "OnePlus 12": {
      "Screen Replacement": { price: 1600, time: "2-3 hours" },
      "Battery Replacement": { price: 700, time: "1-2 hours" },
      "Camera Repair": { price: 1000, time: "2-4 hours" },
      "Charging Port": { price: 400, time: "1-2 hours" },
      "Speaker Repair": { price: 350, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1800, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 600, time: "1-2 hours" }
    },
    "OnePlus 11": {
      "Screen Replacement": { price: 1400, time: "2-3 hours" },
      "Battery Replacement": { price: 650, time: "1-2 hours" },
      "Camera Repair": { price: 900, time: "2-4 hours" },
      "Charging Port": { price: 350, time: "1-2 hours" },
      "Speaker Repair": { price: 300, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1600, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 550, time: "1-2 hours" }
    },
    "OnePlus Nord 3": {
      "Screen Replacement": { price: 1000, time: "2-3 hours" },
      "Battery Replacement": { price: 500, time: "1-2 hours" },
      "Camera Repair": { price: 600, time: "2-4 hours" },
      "Charging Port": { price: 300, time: "1-2 hours" },
      "Speaker Repair": { price: 250, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1200, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 400, time: "1-2 hours" }
    }
  },
  "Xiaomi": {
    "Xiaomi 14 Ultra": {
      "Screen Replacement": { price: 1800, time: "2-3 hours" },
      "Battery Replacement": { price: 800, time: "1-2 hours" },
      "Camera Repair": { price: 1200, time: "2-4 hours" },
      "Charging Port": { price: 500, time: "1-2 hours" },
      "Speaker Repair": { price: 400, time: "1-2 hours" },
      "Water Damage Treatment": { price: 2000, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 600, time: "1-2 hours" }
    },
    "Xiaomi 13": {
      "Screen Replacement": { price: 1500, time: "2-3 hours" },
      "Battery Replacement": { price: 700, time: "1-2 hours" },
      "Camera Repair": { price: 1000, time: "2-4 hours" },
      "Charging Port": { price: 400, time: "1-2 hours" },
      "Speaker Repair": { price: 350, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1700, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 500, time: "1-2 hours" }
    },
    "Redmi Note 13 Pro": {
      "Screen Replacement": { price: 900, time: "2-3 hours" },
      "Battery Replacement": { price: 450, time: "1-2 hours" },
      "Camera Repair": { price: 600, time: "2-4 hours" },
      "Charging Port": { price: 250, time: "1-2 hours" },
      "Speaker Repair": { price: 200, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1000, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 300, time: "1-2 hours" }
    },
    "POCO X6 Pro": {
      "Screen Replacement": { price: 800, time: "2-3 hours" },
      "Battery Replacement": { price: 400, time: "1-2 hours" },
      "Camera Repair": { price: 500, time: "2-4 hours" },
      "Charging Port": { price: 200, time: "1-2 hours" },
      "Speaker Repair": { price: 180, time: "1-2 hours" },
      "Water Damage Treatment": { price: 900, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 250, time: "1-2 hours" }
    }
  },
  "Google": {
    "Pixel 8 Pro": {
      "Screen Replacement": { price: 1800, time: "2-3 hours" },
      "Battery Replacement": { price: 800, time: "1-2 hours" },
      "Camera Repair": { price: 1200, time: "2-4 hours" },
      "Charging Port": { price: 500, time: "1-2 hours" },
      "Speaker Repair": { price: 400, time: "1-2 hours" },
      "Water Damage Treatment": { price: 2000, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 600, time: "1-2 hours" }
    },
    "Pixel 8": {
      "Screen Replacement": { price: 1600, time: "2-3 hours" },
      "Battery Replacement": { price: 700, time: "1-2 hours" },
      "Camera Repair": { price: 1000, time: "2-4 hours" },
      "Charging Port": { price: 450, time: "1-2 hours" },
      "Speaker Repair": { price: 350, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1800, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 550, time: "1-2 hours" }
    },
    "Pixel 7a": {
      "Screen Replacement": { price: 1200, time: "2-3 hours" },
      "Battery Replacement": { price: 550, time: "1-2 hours" },
      "Camera Repair": { price: 700, time: "2-4 hours" },
      "Charging Port": { price: 350, time: "1-2 hours" },
      "Speaker Repair": { price: 280, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1400, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 400, time: "1-2 hours" }
    }
  },
  "Vivo": {
    "V30 Pro": {
      "Screen Replacement": { price: 1400, time: "2-3 hours" },
      "Battery Replacement": { price: 650, time: "1-2 hours" },
      "Camera Repair": { price: 900, time: "2-4 hours" },
      "Charging Port": { price: 400, time: "1-2 hours" },
      "Speaker Repair": { price: 320, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1600, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 500, time: "1-2 hours" }
    },
    "V29": {
      "Screen Replacement": { price: 1200, time: "2-3 hours" },
      "Battery Replacement": { price: 600, time: "1-2 hours" },
      "Camera Repair": { price: 800, time: "2-4 hours" },
      "Charging Port": { price: 350, time: "1-2 hours" },
      "Speaker Repair": { price: 300, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1400, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 450, time: "1-2 hours" }
    },
    "Y100": {
      "Screen Replacement": { price: 800, time: "2-3 hours" },
      "Battery Replacement": { price: 400, time: "1-2 hours" },
      "Camera Repair": { price: 500, time: "2-4 hours" },
      "Charging Port": { price: 250, time: "1-2 hours" },
      "Speaker Repair": { price: 200, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1000, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 300, time: "1-2 hours" }
    }
  },
  "Oppo": {
    "Reno 11 Pro": {
      "Screen Replacement": { price: 1300, time: "2-3 hours" },
      "Battery Replacement": { price: 600, time: "1-2 hours" },
      "Camera Repair": { price: 850, time: "2-4 hours" },
      "Charging Port": { price: 380, time: "1-2 hours" },
      "Speaker Repair": { price: 310, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1500, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 480, time: "1-2 hours" }
    },
    "Reno 10": {
      "Screen Replacement": { price: 1100, time: "2-3 hours" },
      "Battery Replacement": { price: 550, time: "1-2 hours" },
      "Camera Repair": { price: 750, time: "2-4 hours" },
      "Charging Port": { price: 330, time: "1-2 hours" },
      "Speaker Repair": { price: 280, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1300, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 420, time: "1-2 hours" }
    },
    "A78": {
      "Screen Replacement": { price: 700, time: "2-3 hours" },
      "Battery Replacement": { price: 350, time: "1-2 hours" },
      "Camera Repair": { price: 450, time: "2-4 hours" },
      "Charging Port": { price: 220, time: "1-2 hours" },
      "Speaker Repair": { price: 180, time: "1-2 hours" },
      "Water Damage Treatment": { price: 850, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 280, time: "1-2 hours" }
    }
  },
  "Realme": {
    "GT 5 Pro": {
      "Screen Replacement": { price: 1200, time: "2-3 hours" },
      "Battery Replacement": { price: 550, time: "1-2 hours" },
      "Camera Repair": { price: 800, time: "2-4 hours" },
      "Charging Port": { price: 350, time: "1-2 hours" },
      "Speaker Repair": { price: 290, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1400, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 450, time: "1-2 hours" }
    },
    "12 Pro": {
      "Screen Replacement": { price: 900, time: "2-3 hours" },
      "Battery Replacement": { price: 450, time: "1-2 hours" },
      "Camera Repair": { price: 600, time: "2-4 hours" },
      "Charging Port": { price: 280, time: "1-2 hours" },
      "Speaker Repair": { price: 230, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1100, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 350, time: "1-2 hours" }
    },
    "Narzo 70 Pro": {
      "Screen Replacement": { price: 800, time: "2-3 hours" },
      "Battery Replacement": { price: 400, time: "1-2 hours" },
      "Camera Repair": { price: 500, time: "2-4 hours" },
      "Charging Port": { price: 250, time: "1-2 hours" },
      "Speaker Repair": { price: 200, time: "1-2 hours" },
      "Water Damage Treatment": { price: 950, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 300, time: "1-2 hours" }
    }
  },
  "Nothing": {
    "Phone (2)": {
      "Screen Replacement": { price: 1400, time: "2-3 hours" },
      "Battery Replacement": { price: 650, time: "1-2 hours" },
      "Camera Repair": { price: 900, time: "2-4 hours" },
      "Charging Port": { price: 400, time: "1-2 hours" },
      "Speaker Repair": { price: 330, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1600, time: "4-6 hours" },
      "Glyph Interface": { price: 800, time: "2-3 hours" }
    },
    "Phone (1)": {
      "Screen Replacement": { price: 1200, time: "2-3 hours" },
      "Battery Replacement": { price: 600, time: "1-2 hours" },
      "Camera Repair": { price: 800, time: "2-4 hours" },
      "Charging Port": { price: 350, time: "1-2 hours" },
      "Speaker Repair": { price: 300, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1400, time: "4-6 hours" },
      "Glyph Interface": { price: 700, time: "2-3 hours" }
    }
  },
  "Motorola": {
    "Edge 50 Pro": {
      "Screen Replacement": { price: 1100, time: "2-3 hours" },
      "Battery Replacement": { price: 500, time: "1-2 hours" },
      "Camera Repair": { price: 700, time: "2-4 hours" },
      "Charging Port": { price: 320, time: "1-2 hours" },
      "Speaker Repair": { price: 270, time: "1-2 hours" },
      "Water Damage Treatment": { price: 1300, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 400, time: "1-2 hours" }
    },
    "G84": {
      "Screen Replacement": { price: 800, time: "2-3 hours" },
      "Battery Replacement": { price: 400, time: "1-2 hours" },
      "Camera Repair": { price: 500, time: "2-4 hours" },
      "Charging Port": { price: 250, time: "1-2 hours" },
      "Speaker Repair": { price: 200, time: "1-2 hours" },
      "Water Damage Treatment": { price: 950, time: "4-6 hours" },
      "Fingerprint Sensor": { price: 300, time: "1-2 hours" }
    }
  }
};

export function PricingCalculator() {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string>("");

  useEffect(() => {
    if (selectedBrand && selectedModel && selectedService) {
      const serviceData = pricingData[selectedBrand]?.[selectedModel]?.[selectedService];
      if (serviceData) {
        setCalculatedPrice(serviceData.price);
        setEstimatedTime(serviceData.time);
      }
    } else {
      setCalculatedPrice(null);
      setEstimatedTime("");
    }
  }, [selectedBrand, selectedModel, selectedService]);

  const brands = Object.keys(pricingData);
  const models = selectedBrand ? Object.keys(pricingData[selectedBrand]) : [];
  const services = selectedBrand && selectedModel ? Object.keys(pricingData[selectedBrand][selectedModel]) : [];

  return (
    <Card className="animate-fade-in border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 font-display">
          <Calculator className="w-5 h-5 text-primary" />
          Instant Price Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">Get accurate pricing for your device repair</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Select value={selectedBrand} onValueChange={(value) => {
            setSelectedBrand(value);
            setSelectedModel("");
            setSelectedService("");
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your phone brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedModel} 
            onValueChange={(value) => {
              setSelectedModel(value);
              setSelectedService("");
            }}
            disabled={!selectedBrand}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your phone model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedService} 
            onValueChange={setSelectedService}
            disabled={!selectedModel}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select repair service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>{service}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {calculatedPrice && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 animate-scale-in">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary font-display">
                  <IndianRupee className="w-6 h-6" />
                  {calculatedPrice}
                </div>
                <div className="text-sm text-muted-foreground">Estimated repair cost</div>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>6 month warranty</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap justify-center">
                <Badge variant="secondary" className="text-xs">
                  Genuine Parts
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Certified Technicians
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Same Day Service
                </Badge>
              </div>

              <Link to="/book-repair" className="block">
                <Button className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  Book This Repair Now
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="text-center pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            * Prices may vary based on device condition and parts availability
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

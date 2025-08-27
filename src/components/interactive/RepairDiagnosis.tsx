import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Lightbulb, CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface DiagnosisResult {
  severity: "low" | "medium" | "high";
  estimatedTime: string;
  recommendations: string[];
  possibleCauses: string[];
}

const commonIssues = {
  "screen cracked": {
    severity: "medium" as const,
    estimatedTime: "2-3 hours",
    recommendations: ["Screen Replacement", "Protective Case"],
    possibleCauses: ["Drop damage", "Impact damage", "Pressure damage"]
  },
  "not turning on": {
    severity: "high" as const,
    estimatedTime: "3-5 hours",
    recommendations: ["Battery Replacement", "Charging Port Repair", "Motherboard Check"],
    possibleCauses: ["Dead battery", "Charging port failure", "Hardware malfunction"]
  },
  "battery draining": {
    severity: "medium" as const,
    estimatedTime: "1-2 hours",
    recommendations: ["Battery Replacement", "Software Optimization"],
    possibleCauses: ["Battery degradation", "Background apps", "Hardware issues"]
  },
  "water damage": {
    severity: "high" as const,
    estimatedTime: "4-6 hours",
    recommendations: ["Water Damage Treatment", "Component Inspection", "Data Recovery"],
    possibleCauses: ["Liquid exposure", "Moisture damage", "Corrosion"]
  },
  "charging issues": {
    severity: "medium" as const,
    estimatedTime: "1-2 hours",
    recommendations: ["Charging Port Repair", "Cable Replacement"],
    possibleCauses: ["Port damage", "Cable fault", "Charging IC failure"]
  },
  "camera not working": {
    severity: "medium" as const,
    estimatedTime: "2-3 hours",
    recommendations: ["Camera Repair", "Lens Replacement"],
    possibleCauses: ["Camera module failure", "Lens damage", "Software issues"]
  }
};

export function RepairDiagnosis() {
  const [description, setDescription] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeProblem = async () => {
    if (!description.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple keyword matching for demo
    const lowerDesc = description.toLowerCase();
    let matchedIssue = null;
    
    for (const [key, issue] of Object.entries(commonIssues)) {
      if (lowerDesc.includes(key)) {
        matchedIssue = issue;
        break;
      }
    }
    
    // Default response if no match
    if (!matchedIssue) {
      matchedIssue = {
        severity: "medium" as const,
        estimatedTime: "2-4 hours",
        recommendations: ["Diagnostic Check", "Professional Inspection"],
        possibleCauses: ["Hardware issue", "Software problem", "Component failure"]
      };
    }
    
    setDiagnosis(matchedIssue);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-success";
      case "medium": return "text-secondary";
      case "high": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low": return <CheckCircle className="w-4 h-4" />;
      case "medium": return <AlertTriangle className="w-4 h-4" />;
      case "high": return <AlertTriangle className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5 text-primary" />
          Describe Your Problem
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tell us what's wrong with your device and get instant repair recommendations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the issue with your device... (e.g., 'My phone screen is cracked', 'Battery drains quickly', 'Phone won't turn on')"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="min-h-20"
        />
        
        <Button 
          onClick={analyzeProblem}
          disabled={!description.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4 mr-2" />
              Get Diagnosis
            </>
          )}
        </Button>

        {diagnosis && (
          <div className="space-y-4 mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={getSeverityColor(diagnosis.severity)}>
                {getSeverityIcon(diagnosis.severity)}
              </div>
              <h3 className="font-semibold">Diagnosis Results</h3>
              <Badge variant="outline" className={getSeverityColor(diagnosis.severity)}>
                {diagnosis.severity.toUpperCase()} Priority
              </Badge>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Estimated repair time: <strong>{diagnosis.estimatedTime}</strong></span>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Recommended Services:</h4>
                <div className="flex flex-wrap gap-1">
                  {diagnosis.recommendations.map((rec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Possible Causes:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {diagnosis.possibleCauses.map((cause, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
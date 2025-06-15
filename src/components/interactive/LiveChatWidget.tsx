import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, X, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "support",
      text: "Hi! I'm here to help you with your mobile repair needs. How can I assist you today?",
      time: "Just now"
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: message,
      time: "Just now"
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: messages.length + 2,
        sender: "support",
        text: "Thanks for your message! I'll connect you with our technical expert right away. Expected response time: 2-3 minutes.",
        time: "Just now"
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 animate-bounce-in group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {isOpen ? (
            <X className="h-6 w-6 relative z-10" />
          ) : (
            <MessageCircle className="h-6 w-6 relative z-10 animate-pulse-slow" />
          )}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 z-40 shadow-2xl animate-slide-up border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">Live Support</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs opacity-90">Online now</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-48">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    } animate-fade-in`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t border-border space-y-2">
              <div className="text-xs text-muted-foreground mb-2">Quick Actions:</div>
              <div className="flex gap-2 flex-wrap">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs py-1"
                  onClick={() => setMessage("What are your repair prices?")}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Pricing
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs py-1"
                  onClick={() => setMessage("How long does repair take?")}
                >
                  Repair Time
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs py-1"
                  onClick={() => setMessage("Do you offer pickup service?")}
                >
                  Pickup
                </Badge>
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={handleSendMessage}
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
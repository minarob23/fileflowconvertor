import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Send, CheckCircle, HelpCircle, Clock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      return response.json();
    },
    onSuccess: () => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <Badge variant="secondary" className="px-4 py-2">
              <MessageSquare className="w-4 h-4 mr-2 inline" />
              Contact Us
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Get in Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-8 shadow-2xl border-2 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animation-delay-200">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us more..."
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {contactMutation.isSuccess && (
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        Thank you for your message! We'll get back to you soon.
                      </AlertDescription>
                    </Alert>
                  )}

                  {contactMutation.isError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {contactMutation.error?.message || "Failed to send message. Please try again."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    {contactMutation.isPending ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <div className="space-y-6 animate-fade-in-up animation-delay-400">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-blue-500/5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                    <p className="text-muted-foreground text-sm">
                      We typically respond within 24 hours on business days
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-purple-500/5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Response Time</h3>
                    <p className="text-muted-foreground text-sm">
                      Most inquiries are answered within a few hours during business hours
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-green-500/5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <HelpCircle className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Common Questions</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Before reaching out, check if your question is answered here:
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Max file size: 50MB</li>
                      <li>• Files auto-delete after 30 days</li>
                      <li>• All conversions are free</li>
                      <li>• Unlimited uploads</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}

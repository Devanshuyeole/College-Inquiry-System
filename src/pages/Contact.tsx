import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  <Navbar/>
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
     
      
      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              Get in touch with our admissions team
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Visit Us</CardTitle>
                  <CardDescription>Our campus location</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                   P-51, BSL Road, -Sector, Additional MIDC, Jalgaon, Maharashtra 425003
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Phone className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Call Us</CardTitle>
                  <CardDescription>Available during office hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                     0257-2212999
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Mail className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>We'll respond within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    General: info@educonnect.edu<br />
                    Admissions: admissions@educonnect.edu<br />
                    Support: support@educonnect.edu
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Office Hours</CardTitle>
                  <CardDescription>When we're available</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 10:00 AM - 2:00 PM<br />
                    Sunday: Closed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

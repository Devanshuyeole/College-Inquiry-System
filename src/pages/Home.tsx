import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, ArrowRight, GraduationCap } from "lucide-react";
//import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-campus.jpg";
import Navbar from "@/components/Navbar";

const Home = () => {
  const featuredCourses = [
    { id: 1, title: "Computer Science", description: "Learn programming, AI, and software development", icon: BookOpen },
    { id: 2, title: "Business Administration", description: "Master business strategy and management", icon: Users },
    { id: 4, title: "Data Science and Artificial Intelligence", description: "Build the future with cutting-edge technology", icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90" />
        </div>
        
        <div className="container relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Shape Your Future with Excellence
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who have transformed their lives through quality education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" variant="hero" className="bg-white text-primary hover:bg-white/90">
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/inquiry">
              <Button size="lg" variant="hero" className="bg-white text-primary hover:bg-white/90">
                Ask a Question
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Students" },
              { value: "500+", label: "Faculty" },
              { value: "50+", label: "Programs" },
              { value: "95%", label: "Placement Rate" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get all your questions answered by our admissions team
          </p>
          <Link to="/inquiry">
            <Button size="lg" variant="hero" className="bg-white text-primary hover:bg-white/90">
              Submit Your Inquiry
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Clock, Users, ArrowRight } from "lucide-react";
import { useCourses } from "@/hooks/useDataStore";

const Courses = () => {
  const courses = useCourses();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
    
      
      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">Our Courses</h1>
            <p className="text-muted-foreground text-lg">
              Explore our comprehensive range of programs designed to prepare you for success
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Available Seats: {course.seats}</span>
                      </div>
                      <div className="pt-2 font-semibold text-primary">
                        {course.fee}
                      </div>
                    </div>
                    <Link to={`/courses/${course.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;


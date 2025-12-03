import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Users, Award, Mail } from "lucide-react";
import { useDepartments } from "@/hooks/useDataStore";

const Departments = () => {
  const departments = useDepartments();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
     
      
      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">Our Departments</h1>
            <p className="text-muted-foreground text-lg">
              Meet our world-class faculty and explore our academic divisions
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{dept.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Head: {dept.head}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{dept.faculty} Faculty Members</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">Programs Offered:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dept.programs.map((program, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <Mail className="h-4 w-4" />
                      <span>{dept.email}</span>
                    </div>
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

export default Departments;


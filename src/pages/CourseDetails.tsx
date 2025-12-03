import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import { BookOpen, Clock, Users, ArrowLeft, GraduationCap, FileText } from "lucide-react";
import { IndianRupee } from "lucide-react";

interface FeeStructure {
  tuition?: string;
  registration?: string;
  lab?: string;
  workshop?: string;
  fieldWork?: string;
  materials?: string;
  library?: string;
  total?: string;
}

interface AdmissionCriteria {
  eligibility?: string;
  minimumGrade?: string;
  entranceExam?: string;
}

interface Course {
  _id: string;
  title: string;
  fullDescription?: string;
  category: string;
  duration: string;
  seats: string;
  fee: string;
  feeStructure?: FeeStructure;
  admissionCriteria?: AdmissionCriteria;
  // Legacy fields
  name?: string;
  department?: string;
  instructor?: string;
  credits?: number;
}

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course details");
        const data = await res.json();
        console.log("Fetched course:", data);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
            <Link to="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-12 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container">
            <Link to="/courses">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Button>
            </Link>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {course.category || course.department}
                </Badge>
                <h1 className="text-4xl font-bold mb-4">
                  {course.title || course.name}
                </h1>
              </div>
              <Link to="/inquiry">
                <Button size="lg">
                  Inquiry Now
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="flex items-center gap-3 bg-background/80 p-4 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-background/80 p-4 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Available Seats</p>
                  <p className="font-semibold">{course.seats}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-background/80 p-4 rounded-lg">
                <IndianRupee className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Fee</p>
                  <p className="font-semibold">{course.fee}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-background/80 p-4 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{course.category || course.department}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Course Overview - FIXED: Added CardContent */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <CardTitle>Course Overview</CardTitle>
                    </div>
                    <CardDescription>Program details and information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {course.fullDescription ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {course.fullDescription}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No detailed description available for this course.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Fee Structure */}
                {course.feeStructure && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-6 w-6 text-primary" />
                        <CardTitle>Fee Structure</CardTitle>
                      </div>
                      <CardDescription>Detailed breakdown of course fees</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {course.feeStructure.tuition && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tuition Fee</span>
                            <span className="font-semibold">{course.feeStructure.tuition}</span>
                          </div>
                        )}
                        {course.feeStructure.registration && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Registration Fee</span>
                            <span className="font-semibold">{course.feeStructure.registration}</span>
                          </div>
                        )}
                        {course.feeStructure.lab && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lab Fee</span>
                            <span className="font-semibold">{course.feeStructure.lab}</span>
                          </div>
                        )}
                        {course.feeStructure.workshop && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Workshop Fee</span>
                            <span className="font-semibold">{course.feeStructure.workshop}</span>
                          </div>
                        )}
                        {course.feeStructure.fieldWork && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Field Work Fee</span>
                            <span className="font-semibold">{course.feeStructure.fieldWork}</span>
                          </div>
                        )}
                        {course.feeStructure.materials && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Materials Fee</span>
                            <span className="font-semibold">{course.feeStructure.materials}</span>
                          </div>
                        )}
                        {course.feeStructure.library && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Library Fee</span>
                            <span className="font-semibold">{course.feeStructure.library}</span>
                          </div>
                        )}
                        {course.feeStructure.total && (
                          <>
                            <Separator className="my-3" />
                            <div className="flex justify-between text-lg">
                              <span className="font-semibold">Total Annual Fee</span>
                              <span className="font-bold text-primary">{course.feeStructure.total}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Admission Criteria */}
                {course.admissionCriteria && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <CardTitle>Admission Requirements</CardTitle>
                      </div>
                      <CardDescription>Eligibility and required documents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {course.admissionCriteria.eligibility && (
                        <div>
                          <h4 className="font-semibold mb-2">Eligibility</h4>
                          <p className="text-muted-foreground">{course.admissionCriteria.eligibility}</p>
                        </div>
                      )}
                      {course.admissionCriteria.minimumGrade && (
                        <div>
                          <h4 className="font-semibold mb-2">Minimum Grade</h4>
                          <p className="text-muted-foreground">{course.admissionCriteria.minimumGrade}</p>
                        </div>
                      )}
                      {course.admissionCriteria.entranceExam && (
                        <div>
                          <h4 className="font-semibold mb-2">Entrance Exam</h4>
                          <p className="text-muted-foreground">{course.admissionCriteria.entranceExam}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/inquiry">
                      <Button className="w-full">Inquiry Now</Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline" className="w-full">Contact Us</Button>
                    </Link>
                    <Link to="/courses">
                      <Button variant="outline" className="w-full">View All Courses</Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available Seats</span>
                      <span className="font-semibold">{course.seats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-semibold">{course.category || course.department}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Fee</span>
                      <span className="font-bold text-primary">{course.fee}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetails;
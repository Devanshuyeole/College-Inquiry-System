import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Mail, Phone, Trash2, CheckCircle, MessageSquare, Plus, Edit, X, GraduationCap, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dataStore, Course, Department } from "@/lib/dataStore";
import { useCourses, useDepartments } from "@/hooks/useDataStore";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";



interface AdmissionCriteria {
  eligibility: string;
  minimumGrade: string;
  entranceExam: string;
}

interface FeeStructure {
  tuition: string;
  registration: string;
  lab?: string;
  workshop?: string;
  fieldWork?: string;
  materials?: string;
  library: string;
  total: string;
}

interface ExtendedCourse extends Course {
  fullDescription?: string;
  feeStructure?: FeeStructure;
  admissionCriteria?: AdmissionCriteria;
}

interface ChatbotQuery {
  _id: string;
  sessionId: string;
  userName: string;
  userEmail: string;
  userQuery: string;
  botResponse: string;
  category: string;
  timestamp: string;
  userInfo?: {
    ipAddress: string;
    userAgent: string;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const courses = useCourses();
  const departments = useDepartments();

  // Chatbot queries state
  const [chatbotQueries, setChatbotQueries] = useState<ChatbotQuery[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<ChatbotQuery | null>(null);
  const [queryDetailsOpen, setQueryDetailsOpen] = useState(false);
  const [totalQueries, setTotalQueries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [editingCourse, setEditingCourse] = useState<ExtendedCourse | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [courseTab, setCourseTab] = useState("basic");

  const [courseFormData, setCourseFormData] = useState({
    title: "",
    fullDescription: "",
    category: "",
    duration: "",
    seats: "",
    fee: "",
    tuition: "",
    registration: "",
    lab: "",
    workshop: "",
    fieldWork: "",
    materials: "",
    library: "",
    total: "",
    eligibility: "",
    minimumGrade: "",
    entranceExam: ""
  });

  // Fetch chatbot queries from backend
  useEffect(() => {
    fetchChatbotQueries();
  }, [currentPage]);

  const fetchChatbotQueries = async () => {
    setLoadingQueries(true);
    try {
      const response = await fetch(`http://localhost:3001/api/chatbot/queries?page=${currentPage}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        setChatbotQueries(data.data);
        setTotalQueries(data.pagination.totalQueries);
      } else {
        console.error("Failed to fetch queries");
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setLoadingQueries(false);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/chatbot/queries/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setChatbotQueries(chatbotQueries.filter(q => q._id !== id));
        toast({
          title: "Query Deleted",
          description: "The chatbot query has been removed",
          variant: "destructive"
        });
        fetchChatbotQueries();
      }
    } catch (error) {
      console.error("Error deleting query:", error);
      toast({
        title: "Error",
        description: "Failed to delete query",
        variant: "destructive"
      });
    }
  };

  const viewQueryDetails = (query: ChatbotQuery) => {
    setSelectedQuery(query);
    setQueryDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const openCourseDialog = (course?: Course) => {
    if (course) {
      console.log("Opening edit dialog for course:", course);

      const extendedCourse = course as any; // Use any to access all fields
      setEditingCourse(extendedCourse);

      // Load all form data including extended fields with better fallbacks
      setCourseFormData({
        title: extendedCourse.title || "",
        fullDescription: extendedCourse.fullDescription || "",
        category: extendedCourse.category || "",
        duration: extendedCourse.duration || "",
        seats: extendedCourse.seats || "",
        fee: extendedCourse.fee || "",
        tuition: extendedCourse.feeStructure?.tuition || "",
        registration: extendedCourse.feeStructure?.registration || "",
        lab: extendedCourse.feeStructure?.lab || "",
        workshop: extendedCourse.feeStructure?.workshop || "",
        fieldWork: extendedCourse.feeStructure?.fieldWork || "",
        materials: extendedCourse.feeStructure?.materials || "",
        library: extendedCourse.feeStructure?.library || "",
        total: extendedCourse.feeStructure?.total || "",
        eligibility: extendedCourse.admissionCriteria?.eligibility || "",
        minimumGrade: extendedCourse.admissionCriteria?.minimumGrade || "",
        entranceExam: extendedCourse.admissionCriteria?.entranceExam || ""
      });

      console.log("Form data loaded:", {
        title: extendedCourse.title,
        fullDescription: extendedCourse.fullDescription,
        category: extendedCourse.category,
        seats: extendedCourse.seats
      });

    } else {
      console.log("Opening new course dialog");
      // Reset for new course
      setEditingCourse(null);
      setCourseFormData({
        title: "",
        fullDescription: "",
        category: "",
        duration: "",
        seats: "",
        fee: "",
        tuition: "",
        registration: "",
        lab: "",
        workshop: "",
        fieldWork: "",
        materials: "",
        library: "",
        total: "",
        eligibility: "",
        minimumGrade: "",
        entranceExam: ""
      });
    }

    setCourseDialogOpen(true);
    setCourseTab("basic");
  };

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const newCourse = {
    title: courseFormData.title,
    duration: courseFormData.duration,
    seats: courseFormData.seats,
    fee: courseFormData.fee,
    category: courseFormData.category,
    fullDescription: courseFormData.fullDescription || "",
    feeStructure: {
      tuition: courseFormData.tuition || "",
      registration: courseFormData.registration || "",
      lab: courseFormData.lab || "",
      workshop: courseFormData.workshop || "",
      fieldWork: courseFormData.fieldWork || "",
      materials: courseFormData.materials || "",
      library: courseFormData.library || "",
      total: courseFormData.total || "",
    },
    admissionCriteria: {
      eligibility: courseFormData.eligibility || "",
      minimumGrade: courseFormData.minimumGrade || "",
      entranceExam: courseFormData.entranceExam || ""
    }
  };

  console.log("Sending course data:", JSON.stringify(newCourse, null, 2));

  try {
    const res = await fetch("http://localhost:3001/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    });

    // Log the response for debugging
    const responseText = await res.text();
    console.log("Response status:", res.status);
    console.log("Response text:", responseText);

    if (!res.ok) {
      // Try to parse error message
      let errorMessage = "Failed to add course";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
        if (errorData.details) {
          console.error("Validation errors:", errorData.details);
        }
      } catch (e) {
        console.error("Could not parse error response");
      }
      throw new Error(errorMessage);
    }

    // Parse successful response
    const savedCourse = JSON.parse(responseText);
    console.log("Received saved course:", savedCourse);

    // Add id field for frontend compatibility
    const courseWithId = {
      ...savedCourse,
      id: savedCourse._id || savedCourse.id || Date.now()
    };

    // Update local state with the saved course (includes all fields)
    dataStore.setCourses([...courses, courseWithId]);

    setCourseDialogOpen(false);

    // Reset form
    setCourseFormData({
      title: "",
      fullDescription: "",
      category: "",
      duration: "",
      seats: "",
      fee: "",
      tuition: "",
      registration: "",
      lab: "",
      workshop: "",
      fieldWork: "",
      materials: "",
      library: "",
      total: "",
      eligibility: "",
      minimumGrade: "",
      entranceExam: ""
    });

    toast({
      title: "✅ Course Added",
      description: "New course has been added successfully.",
    });
  } catch (err) {
    console.error("Error adding course:", err);
    toast({
      title: "❌ Failed to Add Course",
      description: err instanceof Error ? err.message : "Please check your backend connection or form data.",
      variant: "destructive",
    });
  }
};

  const handleEditCourse = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!editingCourse) return;

  const updatedCourse = {
    title: courseFormData.title,
    duration: courseFormData.duration,
    seats: courseFormData.seats,
    fee: courseFormData.fee,
    category: courseFormData.category,
    fullDescription: courseFormData.fullDescription || "",
    feeStructure: {
      tuition: courseFormData.tuition || "",
      registration: courseFormData.registration || "",
      lab: courseFormData.lab || "",
      workshop: courseFormData.workshop || "",
      fieldWork: courseFormData.fieldWork || "",
      materials: courseFormData.materials || "",
      library: courseFormData.library || "",
      total: courseFormData.total || "",
    },
    admissionCriteria: {
      eligibility: courseFormData.eligibility || "",
      minimumGrade: courseFormData.minimumGrade || "",
      entranceExam: courseFormData.entranceExam || ""
    }
  };

  console.log("Updating course with data:", JSON.stringify(updatedCourse, null, 2));

  try {
    // Use _id from MongoDB if it exists, otherwise use id
    const mongoId = (editingCourse as any)._id || editingCourse.id;

    const res = await fetch(`http://localhost:3001/api/courses/${mongoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCourse),
    });

    // Log the response for debugging
    const responseText = await res.text();
    console.log("Response status:", res.status);
    console.log("Response text:", responseText);

    if (!res.ok) {
      let errorMessage = "Failed to update course";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error("Could not parse error response");
      }
      throw new Error(errorMessage);
    }

    const savedCourse = JSON.parse(responseText);
    console.log("Received updated course:", savedCourse);

    // Update local state with proper id mapping
    const updatedCourseWithId = {
      ...savedCourse,
      id: editingCourse.id,
      _id: mongoId
    };

    dataStore.setCourses(courses.map(c => c.id === editingCourse.id ? updatedCourseWithId : c));
    setEditingCourse(null);
    setCourseDialogOpen(false);

    toast({
      title: "✅ Course Updated",
      description: "Course has been updated successfully"
    });
  } catch (err) {
    console.error("Error updating course:", err);
    toast({
      title: "❌ Failed to Update Course",
      description: err instanceof Error ? err.message : "Please check your backend connection.",
      variant: "destructive",
    });
  }
};

  const handleDeleteCourse = async (courseId: number | string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      // Find the actual course to get MongoDB _id
      const courseToDelete = courses.find(c => c.id === courseId);
      if (!courseToDelete) {
        throw new Error("Course not found");
      }

      // Use _id from MongoDB if it exists, otherwise use id
      const mongoId = (courseToDelete as any)._id || courseId;

      console.log("Deleting course with ID:", mongoId);

      const res = await fetch(`http://localhost:3001/api/courses/${mongoId}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Delete error:", errorData);
        throw new Error("Failed to delete course");
      }

      // Remove from local state using the original id
      const updatedCourses = courses.filter(c => c.id !== courseId);
      dataStore.setCourses(updatedCourses);

      toast({
        title: "✅ Course Deleted",
        description: "Course has been removed successfully"
      });
    } catch (err) {
      console.error("Error deleting course:", err);
      toast({
        title: "❌ Failed to Delete Course",
        description: err instanceof Error ? err.message : "Please check your backend connection.",
        variant: "destructive",
      });
    }
  };

  const handleAddDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const programs = (formData.get("programs") as string)
      .split(",")
      .map(p => p.trim());

    const newDept = {
      name: formData.get("name") as string,
      head: formData.get("head") as string,
      faculty: parseInt(formData.get("faculty") as string),
      programs: programs,
      email: formData.get("email") as string,
    };

    try {
      const res = await fetch("http://localhost:3001/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDept),
      });

      if (!res.ok) {
        throw new Error(`Failed to add department: ${res.statusText}`);
      }

      const savedDept = await res.json();
      dataStore.setDepartments([...departments, savedDept]);
      setDeptDialogOpen(false);

      toast({
        title: "✅ Department Added",
        description: "New department has been added successfully to the database.",
      });
    } catch (error) {
      console.error("Error adding department:", error);
      toast({
        title: "❌ Failed to Add Department",
        description: "Could not connect to server or invalid data.",
        variant: "destructive",
      });
    }
  };

  const handleEditDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDepartment) return;

    const formData = new FormData(e.currentTarget);
    const programs = (formData.get("programs") as string).split(",").map(p => p.trim());

    const updatedDept = {
      name: formData.get("name") as string,
      head: formData.get("head") as string,
      faculty: parseInt(formData.get("faculty") as string),
      programs: programs,
      email: formData.get("email") as string,
    };

    try {
      // Use _id from MongoDB if it exists, otherwise use id
      const mongoId = (editingDepartment as any)._id || editingDepartment.id;

      const res = await fetch(`http://localhost:3001/api/departments/${mongoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDept),
      });

      if (!res.ok) throw new Error("Failed to update department");

      const savedDept = await res.json();
      dataStore.setDepartments(departments.map(d => d.id === editingDepartment.id ? { ...savedDept, id: editingDepartment.id } : d));
      setEditingDepartment(null);
      setDeptDialogOpen(false);

      toast({
        title: "✅ Department Updated",
        description: "Department has been updated successfully"
      });
    } catch (err) {
      console.error("Error updating department:", err);
      toast({
        title: "❌ Failed to Update Department",
        description: "Please check your backend connection.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDepartment = async (deptId: number | string) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      // Find the actual department to get MongoDB _id
      const deptToDelete = departments.find(d => d.id === deptId);
      if (!deptToDelete) {
        throw new Error("Department not found");
      }

      // Use _id from MongoDB if it exists, otherwise use id
      const mongoId = (deptToDelete as any)._id || deptId;

      console.log("Deleting department with ID:", mongoId);

      const res = await fetch(`http://localhost:3001/api/departments/${mongoId}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Delete error:", errorData);
        throw new Error("Failed to delete department");
      }

      // Remove from local state using the original id
      const updatedDepartments = departments.filter(d => d.id !== deptId);
      dataStore.setDepartments(updatedDepartments);

      toast({
        title: "✅ Department Deleted",
        description: "Department has been removed successfully"
      });
    } catch (err) {
      console.error("Error deleting department:", err);
      toast({
        title: "❌ Failed to Delete Department",
        description: err instanceof Error ? err.message : "Please check your backend connection.",
        variant: "destructive",
      });
    }
  };


  const stats = [
    { label: "Total Queries", value: totalQueries.toString(), icon: MessageSquare },
    {
      label: "Today", value: chatbotQueries.filter(q => {
        const today = new Date().toDateString();
        return new Date(q.timestamp).toDateString() === today;
      }).length.toString(), icon: Mail
    },
    { label: "Categories", value: new Set(chatbotQueries.map(q => q.category)).size.toString(), icon: CheckCircle }
  ];

  return (

    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/Admin/dashboard" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Admin Dashboard</span>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>


        <Tabs defaultValue="chatbot" className="space-y-6">
          <TabsList>
            <TabsTrigger value="chatbot">Chatbot Queries</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>

          <TabsContent value="chatbot">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Chatbot Queries</CardTitle>
                    <CardDescription>View and manage student queries from the AI chatbot</CardDescription>
                  </div>
                  <Button onClick={fetchChatbotQueries} variant="outline" size="sm">
                    Refresh
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {loadingQueries ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading queries...</p>
                  </div>
                ) : chatbotQueries.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No chatbot queries yet</p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Query</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {chatbotQueries.map((query) => (
                          <TableRow key={query._id}>
                            <TableCell className="font-medium">
                              {query.userName || 'Anonymous'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {query.userEmail || 'N/A'}
                            </TableCell>
                            <TableCell className="max-w-md">
                              <div className="truncate">{query.userQuery}</div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(query.timestamp)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => viewQueryDetails(query)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteQuery(query._id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {chatbotQueries.length} of {totalQueries} queries
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manage Courses</CardTitle>
                  <CardDescription>Add, edit, or remove courses with full details</CardDescription>
                </div>
                <Dialog open={courseDialogOpen} onOpenChange={(open) => {
                  setCourseDialogOpen(open);
                  if (!open) setEditingCourse(null);
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openCourseDialog()}>
                      <Plus className="mr-2 h-4 w-4 mt-0" />
                      Add Course
                    </Button>
                  </DialogTrigger>


                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <form onSubmit={editingCourse ? handleEditCourse : handleAddCourse} className="flex flex-col h-full">
                      <DialogHeader>
                        <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
                        <DialogDescription>
                          Complete course information including fees, faculty, admission details, and news
                        </DialogDescription>
                        
                      </DialogHeader>

                      <Tabs value={courseTab} onValueChange={setCourseTab} className="flex-1 overflow-hidden flex flex-col">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="basic">Basic</TabsTrigger>
                          <TabsTrigger value="fees">Fees</TabsTrigger>
                          <TabsTrigger value="admission">Admission</TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-y-auto py-4">

                          <TabsContent value="basic" className="space-y-4 mt-0">
                            <div className="grid gap-2">
                              <Label htmlFor="title">Course Title</Label>
                              <Input
                                id="title"
                                name="title"
                                value={courseFormData.title}
                                onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })} />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="fullDescription">Full Description</Label>
                              <Textarea
                                id="fullDescription"
                                name="fullDescription"
                                value={courseFormData.fullDescription}
                                onChange={(e) => setCourseFormData({ ...courseFormData, fullDescription: e.target.value })}
                                rows={4}
                                placeholder="Detailed course information" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                  id="category"
                                  name="category"
                                  value={courseFormData.category}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })} />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                  id="duration"
                                  name="duration"
                                  value={courseFormData.duration}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                                  required />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="seats">Available Seats</Label>
                                <Input
                                  id="seats"
                                  name="seats"
                                  value={courseFormData.seats}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, seats: e.target.value })}
                                  required />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="fee">Fee (Display)</Label>
                                <Input
                                  id="fee"
                                  name="fee"
                                  value={courseFormData.fee}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, fee: e.target.value })}
                                  required />
                              </div>
                            </div>
                          </TabsContent>


                          <TabsContent value="fees" className="space-y-4 mt-0">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="tuition">Tuition Fee</Label>
                                <Input
                                  id="tuition"
                                  name="tuition"
                                  value={courseFormData.tuition}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, tuition: e.target.value })} />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="registration">Registration Fee</Label>
                                <Input
                                  id="registration"
                                  name="registration"
                                  value={courseFormData.registration}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, registration: e.target.value })} />
                              </div>

                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="lab">Lab Fee (Optional)</Label>
                                <Input
                                  id="lab"
                                  name="lab"
                                  value={courseFormData.lab}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, lab: e.target.value })} />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="workshop">Workshop Fee (Optional)</Label>
                                <Input
                                  id="workshop"
                                  name="workshop"
                                  value={courseFormData.workshop}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, workshop: e.target.value })} />
                              </div>

                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="fieldWork">Field Work Fee (Optional)</Label>
                                <Input
                                  id="fieldWork"
                                  name="fieldWork"
                                  value={courseFormData.fieldWork}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, fieldWork: e.target.value })} />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="materials">Materials Fee (Optional)</Label>
                                <Input
                                  id="materials"
                                  name="materials"
                                  value={courseFormData.materials}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, materials: e.target.value })} />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="library">Library Fee</Label>
                                <Input
                                  id="library"
                                  name="library"
                                  value={courseFormData.library}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, library: e.target.value })} />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="total">Total Annual Fee</Label>
                                <Input
                                  id="total"
                                  name="total"
                                  value={courseFormData.total}
                                  onChange={(e) => setCourseFormData({ ...courseFormData, total: e.target.value })}
                                  className="font-bold" />
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="admission" className="space-y-4 mt-0">
                            <div className="grid gap-2">
                              <Label htmlFor="eligibility">Eligibility</Label>
                              <Textarea
                                id="eligibility"
                                name="eligibility"
                                value={courseFormData.eligibility}
                                onChange={(e) => setCourseFormData({ ...courseFormData, eligibility: e.target.value })}
                                rows={3} />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="minimumGrade">Minimum Grade</Label>
                              <Input
                                id="minimumGrade"
                                name="minimumGrade"
                                value={courseFormData.minimumGrade}
                                onChange={(e) => setCourseFormData({ ...courseFormData, minimumGrade: e.target.value })} />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="entranceExam">Entrance Exam</Label>
                              <Input
                                id="entranceExam"
                                name="entranceExam"
                                value={courseFormData.entranceExam}
                                onChange={(e) => setCourseFormData({ ...courseFormData, entranceExam: e.target.value })} />
                            </div>
                            <Separator />
                          </TabsContent>
                        </div>
                      </Tabs>

                      <DialogFooter className="mt-4">
                        <Button type="submit">{editingCourse ? "Update" : "Add"} Course</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>


              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell><Badge variant="secondary">{course.category}</Badge></TableCell>
                        <TableCell>{course.duration}</TableCell>
                        <TableCell>{course.seats}</TableCell>
                        <TableCell>{course.fee}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openCourseDialog(course)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCourse(course.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="departments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manage Departments</CardTitle>
                  <CardDescription>Add, edit, or remove academic departments</CardDescription>
                </div>
                <Dialog
                  open={deptDialogOpen}
                  onOpenChange={(open) => {
                    setDeptDialogOpen(open);
                    if (!open) setEditingDepartment(null);
                  }}>

                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingDepartment(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Department
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg">
                    <form
                      onSubmit={editingDepartment ? handleEditDepartment : handleAddDepartment}
                      className="space-y-4">

                      <DialogHeader>
                        <DialogTitle>
                          {editingDepartment ? "Edit Department" : "Add New Department"}
                        </DialogTitle>
                        <DialogDescription>
                          Enter department details such as head, faculty count, and programs
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-2">
                        <Label htmlFor="name">Department Name</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={editingDepartment?.name || ""}
                          required/>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="head">Head of Department</Label>
                        <Input
                          id="head"
                          name="head"
                          defaultValue={editingDepartment?.head || ""}
                          required/>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="faculty">Faculty Count</Label>
                        <Input
                          id="faculty"
                          name="faculty"
                          type="number"
                          defaultValue={editingDepartment?.faculty || ""}
                          required/>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="programs">Programs (comma-separated)</Label>
                        <Input
                          id="programs"
                          name="programs"
                          defaultValue={editingDepartment?.programs.join(", ") || ""}
                          placeholder="e.g., B.Tech, M.Tech"
                          required/>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Department Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          defaultValue={editingDepartment?.email || ""}
                          required/>
                      </div>

                      <DialogFooter>
                        <Button type="submit">
                          {editingDepartment ? "Update" : "Add"} Department
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Head</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Programs</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.head}</TableCell>
                        <TableCell>{dept.faculty}</TableCell>
                        <TableCell>{dept.programs.join(", ")}</TableCell>
                        <TableCell>{dept.email}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingDepartment(dept);
                                setDeptDialogOpen(true);
                              }}>

                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteDepartment(dept.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Query Details Dialog */}
      <Dialog open={queryDetailsOpen} onOpenChange={setQueryDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Query Details</DialogTitle>
            <DialogDescription>
              Full conversation details from the chatbot
            </DialogDescription>
          </DialogHeader>

          {selectedQuery && (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">User Name</Label>
                    <p className="font-medium text-sm mt-1">{selectedQuery.userName || 'Anonymous'}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-sm mt-1">{selectedQuery.userEmail || 'N/A'}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Session ID</Label>
                    <p className="font-mono text-xs mt-1">{selectedQuery.sessionId}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <div className="mt-1">
                      <Badge>{selectedQuery.category}</Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Date & Time</Label>
                    <p className="text-sm mt-1">{formatDate(selectedQuery.timestamp)}</p>
                  </div>

                  {selectedQuery.userInfo?.ipAddress && (
                    <div>
                      <Label className="text-muted-foreground">IP Address</Label>
                      <p className="font-mono text-sm mt-1">{selectedQuery.userInfo.ipAddress}</p>
                    </div>
                  )}
                </div>
                <Separator />

                <div>
                  <Label className="text-muted-foreground">User Query</Label>
                  <Card className="mt-2 p-4 bg-muted">
                    <p className="text-sm">{selectedQuery.userQuery}</p>
                  </Card>
                </div>

                <div>
                  <Label className="text-muted-foreground">Bot Response</Label>
                  <Card className="mt-2 p-4">
                    <p className="text-sm whitespace-pre-line">{selectedQuery.botResponse}</p>
                  </Card>
                </div>

                {selectedQuery.userInfo?.userAgent && (
                  <div>
                    <Label className="text-muted-foreground">User Agent</Label>
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      {selectedQuery.userInfo.userAgent}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setQueryDetailsOpen(false)}>
              Close
            </Button>
            {selectedQuery && (
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteQuery(selectedQuery._id);
                  setQueryDetailsOpen(false);
                }}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Query
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
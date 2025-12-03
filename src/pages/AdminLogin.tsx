import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

const API_URL = "http://localhost:3001/api/admin";

interface Credentials {
  name: string;
  email: string;
  password: string;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [credentials, setCredentials] = useState<Credentials>({
    name: "",
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showMessage = (type: 'success' | 'error', text: string) => setMessage({ type, text });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let endpoint = isLogin ? 'login' : 'signup';

      if (!credentials.email || !credentials.password || (!isLogin && !credentials.name)) {
        showMessage('error', "Please fill all required fields");
        setIsLoading(false);
        return;
      }

      if (!validateEmail(credentials.email)) {
        showMessage('error', "Please enter a valid email");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("success", isLogin ? "Login successful!" : "Admin account created successfully!");

        // Store minimal admin info
        localStorage.setItem("adminAuth", JSON.stringify({
          name: data.admin.name,
          email: data.admin.email,
        }));

        setTimeout(() => navigate("/admin/dashboard"), 1000);
      } else {
        showMessage("error", data.message || "Authentication failed");
      }

    } catch (err) {
      console.error(err);
      showMessage("error", "Server error. Please try again later.");
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setCredentials({ name: "", email: "", password: "" });
    setMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{isLogin ? "Admin Login" : "Admin Registration"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Access the college inquiry management system"
              : "Create your admin account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={credentials.name}
                  onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </>
            )}

            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@educonnect.edu"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
              disabled={isLoading}
            />

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={isLogin ? "Enter your password" : "Minimum 6 characters"}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              disabled={isLoading}
            />

            {message && (
              <Alert variant={message.type === "error" ? "destructive" : "default"}>
                {message.type === "success"
                  ? <CheckCircle className="h-4 w-4" />
                  : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={toggleMode}
                disabled={isLoading}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

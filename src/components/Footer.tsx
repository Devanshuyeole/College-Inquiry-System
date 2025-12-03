import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {/* EduConnect */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">EduConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering students with quality education and endless opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="text-muted-foreground hover:text-primary">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/departments" className="text-muted-foreground hover:text-primary">
                  Departments
                </Link>
              </li>
              <li>
                <Link to="/inquiry" className="text-muted-foreground hover:text-primary">
                  Submit Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="text-center">
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-center items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                P-51, BSL Road, -Sector, Additional MIDC, Jalgaon, Maharashtra 425003
              </li>
              <li className="flex justify-center items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                0257-2212999
              </li>
              <li className="flex justify-center items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                info@educonnect.edu
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground max-w-5xl w-full">
          <p>© 2025 EduConnect College. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

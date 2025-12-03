import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Send, Bot, User, GraduationCap, ArrowLeft } from 'lucide-react';

const CollegeInquiryChatbot = () => {
  const { isAuthenticated, user } = useAuth(); // ✅ Get user from context
  const navigate = useNavigate();

  const sessionIdRef = useRef<string>(`session-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Welcome to EduConnect! 🎓 I\'m here to help you with any questions about our programs, admissions, campus facilities, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const knowledgeBase = {

    BtechFees: {
      keywords: ['b.tech fee', 'btech fee', 'b.tech fees', 'btech fees', 'b.e fee', 'be fee', 'b.e fees', 'be fees', "b.tech fee's", "btech fee's"],
      response: ` Open Category : 70000 Rs
                  OBC Category : 38000 Rs
                  SC/ST : 7000 Rs
                  For Each Department`
    },

    MtechFees: {
      keywords: ['m.tech fee', 'mtech fee', 'mtech fees', 'm.tech fees', "m.tech fee's", "mtech fee's"],
      response: `Open Category : 80000 Rs
                  OBC Category : 40000 Rs
                  SC/ST : 9000 Rs
                  For Each Department`
    },

    DiplomaFees: {
      keywords: ['diploma fee', 'diploma fees', "diploma fees's"],
      response: `Open Category : 20000 Rs
                  OBC Category : 8000 Rs
                  SC/ST : 2000 Rs
                  For Each Department`
    },

    Fees: {
      keywords: ['fee', 'fees', "fees's"],
      response: `**B.Tech**
                  Open Category : 70000 Rs
                  OBC Category : 38000 Rs
                  SC/ST : 7000 Rs
                  For Each Department
                  
                  **M.Tech**
                  Open Category : 80000 Rs
                  OBC Category : 40000 Rs
                  SC/ST : 9000 Rs
                  For Each Department
                  
                  **Diploma**
                  Open Category : 20000 Rs
                  OBC Category : 8000 Rs
                  SC/ST : 2000 Rs
                  For Each Department`
    },

    BtechIntake: {
      keywords: ['b.tech intake', 'btech intake', 'btech intakes', 'b.tech intakes', 'btech seats', 'b.tech seats', 'btech seat', 'b.tech seat', 'b.e intake', 'be intake', 'be intakes', 'b.e intakes', 'be seats', 'b.e seats', 'be seat', 'b.e seat',
        "btech intake's", "b.tech intake's", "btech seat's", "b.tech seat's", "b.e intake's", "be intake's", "b.e seat's", "be seat's"],
      response: ` Computer Science & Engineering - 120
                  Electronics & Communication Engineering - 120
                  Mechanical Engineering - 60
                  Civil Engineering - 60
                  Information Technology - 60`
    },

    MtechIntake: {
      keywords: ['m.tech intake', 'mtech intake', 'm.tech intakes', 'mtech intakes', 'm.tech seats', 'mtech seats', 'm.tech seat', 'mtech seat', "m.tech intake's", "mtech intake's", "m.tech seat's", "mtech seat's"],
      response: `
                  VLSI - 18
                  Thermal - 18
                  AI - 18
                  CSE - 18
                  Civil - 18`
    },

    DiplomaIntake: {
      keywords: ['diploma intake', 'diploma intakes', 'diploma seats', 'diploma seat', "diploma intake's", "diploma seat's"],
      response: ` CSE - 60
                  Electrical - 60
                  E&TC - 60
                  Civil - 60
                  Mechnical - 60`
    },

    Intake: {
      keywords: ['intake', 'intakes', 'seats', 'seat', "intake's", "seat's"],
      response: `**B.Tech**
                  Computer Science & Engineering - 120
                  Electronics & Communication Engineering - 120
                  Mechanical Engineering - 60
                  Civil Engineering - 60
                  Information Technology - 60
                  
                  **M.Tech**
                  VLSI - 18
                  Thermal - 18
                  AI - 18
                  CSE - 18
                  Civil - 18
                  
                  **Diploma**
                  CSE - 60
                  Electrical - 60
                  E&TC - 60
                  Civil - 60
                  Mechnical - 60`
    },

    hostelfees: {
      keywords: ['hostel fee', 'hostel fees', "hostel fee's", 'hostel cost', 'room rent'],
      response: `🏠 **Hostel Fee Structure (Annual):**

• Single Occupancy: ₹80,000/year
• Double Occupancy: ₹60,000/year
• Triple Occupancy: ₹45,000/year

*Includes: Room, Electricity, Wi-Fi, Maintenance*
*Mess charges separate: ₹36,000/year*`
    },

    messfees: {
      keywords: ['mess fee', 'mess fees', "mess fee's", 'mess', 'food fee', 'food fees', "food fee's", 'canteen', 'meal', 'meal fee', 'meal fees', "meal fee's"],
      response: `🍽️ **Mess Fee:**

• ₹36,000/year (₹3,000/month)
• Includes 3 meals daily (Breakfast, Lunch, Dinner)
• Vegetarian and Non-vegetarian options available`
    },

    totalfees: {
      keywords: ['total fee', 'total fees', "total fee's", 'total cost', 'overall fee', 'overall fees', "overall fee's", 'complete fee', 'complete fees', "complete fee's", 'all fees', 'all fee', "all fee's"],
      response: `💵 **Total Fee Breakdown for B.Tech:**

• Tuition Fee: ₹70,000
• Hostel Fee (single): ₹80,000/year
• Hostel Fee (Double): ₹60,000/year
• Mess Fee: ₹36,000/year
• Exam Fee: ₹1,000/semester*`
    },

    scholarship: {
      keywords: ['scholarship', 'scholarships', "scholarship's", 'financial aid', 'financial aids', "financial aid's", 'waiver', 'discount'],
      response: `🎓 **Scholarships Available:**

• Merit-based: Up to 50% tuition waiver
• Need-based: Up to 30% tuition waiver
• Sports quota: Up to 25% tuition waiver
• Girl child scholarship: ₹10,000/year
• SC/ST/OBC scholarship: As per government norms`
    },

    BtechDepartements: {
      keywords: ['btech department', 'b.tech department', 'btech course', 'b.tech course', 'btech departments', 'b.tech departments', 'btech courses', 'b.tech courses', 'btech branch', 'b.tech branch', 'btech branches', 'b.tech branches', 'btech stream', 'b.tech stream', 'btech streams', 'b.tech streams', "btech department's", "b.tech department's", "btech course's", "b.tech course's", "btech branch's", "b.tech branch's", "btech stream's", "b.tech stream's",
        'be department', 'b.e department', 'be course', 'b.e course', 'be departments', 'b.e departments', 'be courses', 'b.e courses', 'bebranch', 'b.ebranch', 'be branches', 'b.e branches', 'be stream', 'b.e stream', 'be streams', 'b.e streams', "be department's", "b.e department's", "be course's", "b.e course's", "be branch's", "b.e branch's", "be stream's", "b.e stream's"
      ],
      response: `• Computer Science & Engineering
                 • Electronics & Communication Engineering
                 • Mechanical Engineering
                 • Civil Engineering
                 • Information Technology`
    },

    MtechDepartements: {
      keywords: ['mtech department', 'm.tech department', 'mtech course', 'm.tech course', 'mtech departments', 'm.tech departments', 'mtech courses', 'm.tech courses', 'mtech branch', 'm.tech branch', 'mtech branches', 'm.tech branches', 'mtech stream', 'm.tech stream', 'mtech streams', 'm.tech streams', "mtech department's", "m.tech department's", "mtech course's", "m.tech course's", "mtech branch's", "m.tech branch's", "mtech stream's", "m.tech stream's"],
      response: `• VLSI
                 • Thermal
                 • AI
                 • CSE
                 • Civil`
    },

    DiplomaDepartements: {
      keywords: ['diploma department', 'diploma course', 'diploma departments', 'diploma courses', 'diploma branch', 'diploma branches', 'diploma stream', 'diploma streams', "diploma department's", "diploma course's", "diploma branch's", "diploma stream's"],
      response: `• CSE
                 • Electrical
                 • E&TC
                 • Civil
                 • Mechnical`
    },
    



    courses: {
      keywords: ['course', 'courses', 'program', 'programs', 'degree', 'degrees', "course's", "program's", "degree's",'department', 'departments', 'branch', 'branches', 'stream', 'streams', "department's", "branch's", "stream's"],
      response: `📚 **Available Programs:**

**Undergraduate (4 years):**
• Computer Science & Engineering
• Electronics & Communication Engineering
• Mechanical Engineering
• Civil Engineering
• Information Technology

**Postgraduate (2 years):**
• VLSI
• Thermal
• AI
• CSE
• Civil

**Diploma (3 years):**
• CSE
• Electrical
• E&TC
• Civil
• Mechnical`
    },

    BtechAdmissions: {
      keywords: ['btech admission', 'b.tech admission', 'btech admissions', 'b.tech admissions', 'btech apply', 'b.tech apply', 'btech application', 'b.tech application', 'how to apply for btech', 'how to apply for b.tech', 'btech eligibility', 'b.tech eligibility', 'btech eligible', 'b.tech eligible', 'btech requirements', 'b.tech requirements', 'btech qualify', 'b.tech qualify', 'btech criteria', 'b.tech criteria', , "btech admission's", "b.tech admission's", "btech requirement's", "b.tech requirement's",
        'be admission', 'b.e admission', 'be admissions', 'b.e admissions', 'be apply', 'b.e apply', 'be application', 'b.e application', 'how to apply for be', 'how to apply for b.e', 'be eligibility', 'b.e eligibility', 'be eligible', 'b.e eligible', 'be requirements', 'b.e requirements', 'be qualify', 'b.e qualify', 'be criteria', 'b.e criteria', "be admission's", "b.e admission's", "be requirement's", "b.e requirement's"
      ],
      response: `📝 **Admission Process:**

• Application Period: June 15 - July 20
•  10th/12th (PCM) pass 
• Entrance Exam: JEE/MHT-CET
• Apply online at: admissions.educonnect.edu`
    },

    MtechAdmissions: {
      keywords: ['mtech admission', 'm.tech admission', 'mtech admissions', 'm.tech admissions', 'mtech apply', 'm.tech apply', 'mtech application', 'm.tech application', 'how to apply for mtech', 'how to apply for m.tech', 'mtech eligibility', 'm.tech eligibility', 'mtech eligible', 'm.tech eligible', 'mtech requirements', 'm.tech requirements', 'mtech qualify', 'm.tech qualify', 'mtech criteria', 'm.tech criteria', "mtech admission's", "m.tech admission's", "mtech requirement's", "m.tech requirement's",
      ],
      response: `📝 **Admission Process:**

• Application Period: June 15 - July 20
• B.E/B.Tech Degree (Min 60 %)
• Entrance Exam: GATE
• Apply online at: admissions.educonnect.edu`
    },

    DiplomaAdmissions: {
      keywords: ['diploma admission', 'diploma admissions', 'diploma apply', 'diploma application', 'how to apply for diploma', 'diploma eligibility', 'diploma eligible', 'diploma requirements', 'diploma qualify', 'diploma criteria', "diploma admission's", "diploma requirement's"],
      response: `📝 **Admission Process:**

• Application Period: 1 August - 5 SEptember
• 10th/12th (PCM) pass (min 60 %)
• Apply online at: admissions.educonnect.edu`
    },

    Admissions: {
      keywords: ['admission', 'admissions', "admission's", 'apply', 'application', 'how to apply', 'eligibility', 'eligible', 'requirements', 'qualify', 'criteria', "requirement's"],
      response: `Admissions are closed currently. Please check back next year for the new admission cycle dates.`
    },

    BtechDocuments: {
      keywords: ['btech document', 'b.tech document', 'btech documents', 'b.tech documents', 'be document', 'b.e document', 'be documents', 'b.e documents', "btech document's", "b.tech document's", "be document's", "b.e document's"],
      response: `📄 **Required Documents:**
      • 10th,12th,JEE/MHT-CET Marksheet
      • Domicile Certificate
      • LC/TC
      • Aadhar Card
      • CAP Application form
      • Seat Allotment Letter

      ** OBC,SC/ST **
      • Caste Certificate
      • Caste Validity
      • Non Creamy Layer
      • Income

      ** Open **
      If you don't have OBC,SC/ST Csertificates then it will be treated as Open`
    },

    MtechDocuments: {
      keywords: ['mtech document', 'm.tech document', 'mtech documents', 'm.tech documents', "mtech document's", "m.tech document's"],
      response: `📄 **Required Documents:**
      • 10th,12th,B.E/B.tech all semester,GATE Marksheet
      • B.E/B.Tech Degree
      • Aadhar Card
      • Domicile Certificate
      • CAP Application form
      • Seat Allotment Letter

      ** OBC,SC/ST **
      • Caste Certificate
      • Caste Validity
      • Non Creamy Layer
      • Income

      ** Open **
      If you don't have OBC,SC/ST Csertificates then it will be treated as Open`
    },

    DiplomaDocuments: {
      keywords: ['diploma document', 'diploma documents', "diploma document's"],
      response: `📄 **Required Documents:**
       • 10th,12th Marksheet
      • TC/LC
      • Domicile Certificate
      • 10th,12th Marksheet
      • CAP Application form
      • Seat Allotment Letter

      ** OBC,SC/ST **
      • Caste Certificate
      • Caste Validity
      • Non Creamy Layer
      • Income

      ** Open **
      If you don't have OBC,SC/ST Csertificates then it will be treated as Open`
    },

    documents: {
      keywords: ['document', 'documents', 'papers', 'certificates', "document's", "certificate's", "paper's"],
      response: `📄 **Required Documents:**
      ** B.Tech **
      • 10th,12th,JEE/MHT-CET Marksheet
      • Domicile Certificate
      • LC/TC
      • Aadhar Card
      • CAP Application form
      • Seat Allotment Letter

      ** OBC,SC/ST **
      • Caste Certificate
      • Caste Validity
      • Non Creamy Layer
      • Income

      ** Open **
      If you don't have OBC,SC/ST Csertificates then it will be treated as Open
      
      ** M.Tech **
      • 10th,12th,B.E/B.tech all semester,GATE Marksheet
      • B.E/B.Tech Degree
      • Aadhar Card
      • Domicile Certificate
      • CAP Application form
      • Seat Allotment Letter

      ** OBC,SC/ST **
      • Caste Certificate
      • Caste Validity
      • Non Creamy Layer
      • Income

      ** Open **
      If you don't have OBC,SC/ST Csertificates then it will be treated as Open


      ** Diploma **
      • 10th,12th Marksheet
      • TC/LC
      • Domicile Certificate
      • 10th,12th Marksheet
      • CAP Application form
      • Seat Allotment Letter

      ** OBC,SC/ST **
      • Caste Certificate
      • Caste Validity
      • Non Creamy Layer
      • Income

      ** Open **
      If you don't have OBC,SC/ST Csertificates then it will be treated as Open `
    },

    hostel: {
      keywords: ['hostel details', "hostel detail's", 'hostel detail', 'accommodation', 'residence', 'dormitory', 'stay'],
      response: `🏠 **Hostel Facilities:**

• Separate hostels for boys and girls
• Wi-Fi enabled rooms
• 24/7 security
• Mess facility with varied menu
• Common room and recreational areas`
    },

    library: {
      keywords: ['library', 'books', 'reading'],
      response: `📖 **Library Facilities:**

• 50,000+ books collection
• E-resources and online journals
• 24/7 reading rooms
• Digital library access
• Study cubicles available`
    },

    Complabs: {
      keywords: ['computer lab', 'computer labs', "computer lab's", 'computer laboratory', 'computer laboratories', 'computer workshop', 'cs lab', 'cs labs', "cs lab's", 'cs laboratory', 'cs laboratories', 'cs workshop', 'cse lab', 'cse labs', "cse lab's", 'cse laboratory', 'cse laboratories', 'cse workshop', 'computer department labs', 'cs department labs', 'cse department labs', 'cse lab details', 'cs lab details'],
      response: `Programming Lab
     Data Structures & Algorithms Lab
      Database Management System (DBMS) Lab
      Computer Networks Lab
      Operating Systems Lab
      Machine Learning & AI Lab
      Cyber Security Lab 
      
      **Available during College Hours**`
    },

    ITlabs: {
      keywords: ['it lab', 'it labs', "it lab's", 'it laboratory', 'it laboratories', 'it workshop', 'information technology lab', 'information technology labs', "information technology lab's", 'information technology laboratory', 'information technology laboratories', 'information technology workshop', 'it department labs', 'information technology department labs', 'it department labs', 'it lab details', 'information technology lab details'],
      response: `Network Administration Lab
      Web Development Lab
      Software Engineering Lab
      Cloud Computing Lab
      Data Analytics Lab
      Mobile Application Development Lab
      
      **Available during College Hours**`
    },

    Entclabs: {
      keywords: ['electronics and telecommunication lab', 'electronics and telecommunication labs', "electronics and telecommunication lab's", 'electronics and telecommunication laboratory', 'electronics and telecommunication laboratories', 'electronics and telecommunication workshop', 'entc lab', 'entc labs', "entc lab's", 'entc laboratory', 'entc laboratories', 'entc workshop', 'entce lab', 'e&tc labs', "e&tc lab's", 'e&tc laboratory', 'e&tc laboratories', 'e&tc workshop', 'e&tc department labs', 'entc department labs', 'e&tc department labs', 'e&tc lab details', 'entc lab details'],
      response: `Basic Electronics Lab
      Digital Electronics Lab
      Analog Circuits Lab
      Microprocessor & Microcontroller Lab
      Communication Engineering Lab
      VLSI Design Lab
      
      **Available during College Hours**`
    },

    Mechanicallabs: {
      keywords: ['mechanical lab', 'mechanical labs', "mechanical lab's", 'mechanical laboratory', 'mechanical laboratories', 'mechanical workshop', 'mech lab', 'mech labs', "mech lab's", 'mech laboratory', 'mech laboratories', 'mech workshop', 'mechanical department labs', 'mech department labs', 'mechanical department labs', 'mech lab details', 'mechanical lab details'],
      response: `Thermodynamics Lab
      Fluid Mechanics Lab
      Heat Transfer Lab
      Manufacturing Processes Lab
      CAD/CAM Lab
      Material Testing Lab
      
      **Available during College Hours**`
    },

    Civillabs: {
      keywords: ['civil lab', 'civil labs', "civil lab's", 'civil laboratory', 'civil laboratories', 'civil workshop', 'civil engineering lab', 'civil engineering labs', "civil engineering lab's", 'civil engineering laboratory', 'civil engineering laboratories', 'civil engineering workshop',  'civil department labs', 'civil department labs', 'civil department labs', 'civil lab details', 'civil lab details'],
      response: `Surveying Lab
      Geotechnical Engineering Lab
      Structural Analysis Lab
      Environmental Engineering Lab
      Transportation Engineering Lab
      Concrete and Material Testing Lab
      
      **Available during College Hours**`
    },

    Btechlabs: {
      keywords: ['btech lab', 'b.tech lab', 'btech labs', 'b.tech labs', "btech lab's", "b.tech lab's", 'btech laboratory', 'b.tech laboratory', 'btech laboratories', 'b.tech laboratories', 'btech workshop', 'b.tech workshop', 'btech department labs', 'b.tech department labs', 'btech lab details', 'b.tech lab details',
        'be lab', 'b.e lab', 'be labs', 'b.e labs', "be lab's", "b.e lab's", 'be laboratory', 'b.e laboratory', 'be laboratories', 'b.e laboratories', 'be workshop', 'b.e workshop', 'be department labs', 'b.e department labs', 'be lab details', 'b.e lab details'
      ],
      response: `🔧 **Computer Department Labs**
      Programming Lab
     Data Structures & Algorithms Lab
      Database Management System (DBMS) Lab
      Computer Networks Lab
      Operating Systems Lab
      Machine Learning & AI Lab
      Cyber Security Lab 

      **IT Department Labs**
      Network Administration Lab
      Web Development Lab
      Software Engineering Lab
      Cloud Computing Lab
      Data Analytics Lab
      Mobile Application Development Lab

      **E&TC Department Labs**
      Basic Electronics Lab
      Digital Electronics Lab
      Analog Circuits Lab
      Microprocessor & Microcontroller Lab
      Communication Engineering Lab
      VLSI Design Lab

      **Mechanical Department Labs**
      Thermodynamics Lab
      Fluid Mechanics Lab
      Heat Transfer Lab
      Manufacturing Processes Lab
      CAD/CAM Lab
      Material Testing Lab

      **Civil Department Labs**
      Surveying Lab
      Geotechnical Engineering Lab
      Structural Analysis Lab
      Environmental Engineering Lab
      Transportation Engineering Lab
      Concrete and Material Testing Lab

      **Available during College Hours**

      `},

      VLSIlabs: {
      keywords: ['vlsi lab', 'vlsi labs', "vlsi lab's", 'vlsi laboratory', 'vlsi laboratories', 'vlsi workshop', 'vlsi design lab', 'vlsi design labs', "vlsi design lab's", 'vlsi design laboratory', 'vlsi design laboratories', 'vlsi design workshop', 'vlsi department labs', 'vlsi department labs', 'vlsi lab details', 'vlsi lab details'],
      response: `
      Digital VLSI Design Lab
      Analog VLSI Design Lab
      VLSI Testing and Verification Lab
      FPGA Design Lab
      Mixed-Signal VLSI Lab

      **Available during College Hours**
      `
    },

    Thermallabs: {
      keywords: ['thermal lab', 'thermal labs', "thermal lab's", 'thermal laboratory', 'thermal laboratories', 'thermal workshop', 'thermal engineering lab', 'thermal engineering labs', "thermal engineering lab's", 'thermal engineering laboratory', 'thermal engineering laboratories', 'thermal engineering workshop',  'thermal department labs', 'thermal department labs', 'thermal department labs', 'thermal lab details', 'thermal lab details'],
      response: `Heat Transfer Lab
      Fluid Mechanics Lab
      Thermodynamics Lab
      Refrigeration and Air Conditioning Lab
      Thermal Engineering Lab
      Computational Fluid Dynamics (CFD) Lab

      **Available during College Hours**
      `
    },

    Ailabs: {
      keywords: ['ai lab', 'ai labs', "ai lab's", 'ai laboratory', 'ai laboratories', 'ai workshop', 'artificial intelligence lab', 'artificial intelligence labs', "artificial intelligence lab's", 'artificial intelligence laboratory', 'artificial intelligence laboratories', 'artificial intelligence workshop',  'ai department labs', 'artificial intelligence department labs', 'ai department labs', 'ai lab details', 'artificial intelligence lab details'],
      response: `Machine Learning Lab
      Deep Learning Lab
      Natural Language Processing Lab
      Computer Vision Lab
      Robotics Lab
      AI Research Lab
      
      **Available during College Hours**`
    },

    Mtechlabs: {
      keywords: ['mtech lab', 'm.tech lab', 'mtech labs', 'm.tech labs', "mtech lab's", "m.tech lab's", 'mtech laboratory', 'm.tech laboratory', 'mtech laboratories', 'm.tech laboratories', 'mtech workshop', 'm.tech workshop', 'mtech department labs', 'm.tech department labs', 'mtech lab details', 'm.tech lab details',],
      response: `🔧 **VLSI Department Labs**
      Digital VLSI Design Lab
      Analog VLSI Design Lab
      VLSI Testing and Verification Lab
      FPGA Design Lab
      Mixed-Signal VLSI Lab

      **Thermal Department Labs**
      Heat Transfer Lab
      Fluid Mechanics Lab
      Thermodynamics Lab
      Refrigeration and Air Conditioning Lab
      Thermal Engineering Lab
      Computational Fluid Dynamics (CFD) Lab

      **AI Department Labs**
      Machine Learning Lab
      Deep Learning Lab
      Natural Language Processing Lab
      Computer Vision Lab
      Robotics Lab
      AI Research Lab

      **Computer Department Labs**
      Programming Lab
     Data Structures & Algorithms Lab
      Database Management System (DBMS) Lab
      Computer Networks Lab
      Operating Systems Lab
      Machine Learning & AI Lab
      Cyber Security Lab

      **Civil Department Labs**
      Surveying Lab
      Geotechnical Engineering Lab
      Structural Analysis Lab
      Environmental Engineering Lab
      Transportation Engineering Lab
      Concrete and Material Testing Lab
      
      **Available during College Hours**`},

      Electricallabs: {
      keywords: ['electrical lab', 'electrical labs', "electrical lab's", 'electrical laboratory', 'electrical laboratories', 'electrical workshop', 'electrical engineering lab', 'electrical engineering labs', "electrical engineering lab's", 'electrical engineering laboratory', 'electrical engineering laboratories', 'electrical engineering workshop',  'electrical department labs', 'electrical department labs', 'electrical department labs', 'electrical lab details', 'electrical lab details'],
      response: `
      Power Systems Lab
      Electrical Machines Lab
      Control Systems Lab
      Power Electronics Lab
      Renewable Energy Lab
      Electrical Measurements Lab

      **Available during College Hours**
      `
    },

    Diplomalabs: {
      keywords: ['diploma lab', 'diploma labs', "diploma lab's", 'diploma laboratory', 'diploma laboratories', 'diploma workshop', 'diploma department labs', 'diploma department labs', 'diploma lab details', 'diploma lab details'],
      response: `**Computer Department Labs**
      Programming Lab
     Data Structures & Algorithms Lab
      Database Management System (DBMS) Lab
      Computer Networks Lab
      Operating Systems Lab

      **Electrical Department Labs**
      Power Systems Lab
      Electrical Machines Lab
      Control Systems Lab

      **E&TC Department Labs**
      Basic Electronics Lab
      Digital Electronics Lab
      Analog Circuits Lab

      **Mechanical Department Labs**
      Thermodynamics Lab
      Fluid Mechanics Lab

      **Civil Department Labs**
      Surveying Lab
      Geotechnical Engineering Lab
      Structural Analysis Lab
      Environmental Engineering Lab
      Transportation Engineering Lab
      Concrete and Material Testing Lab

      **Available during College Hours**
      `},

    labs: {
      keywords: ['lab', 'labs', 'laboratory', 'laboratories', 'workshop'],
      response: `Labs are divided course wise. Please specify the department or course for detailed lab information.
      **Available during College Hours**`
    },

    labTimings: {
      keywords: ['lab timing', 'lab timings', "lab timing's", 'lab hours', 'lab schedule', 'laboratory timing', 'laboratory timings', "laboratory timing's", 'laboratory hours', 'laboratory schedule', 'workshop timing', 'workshop timings', "workshop timing's", 'workshop hours', 'workshop schedule','Is there a computer center available 24/7?', 'What are the operating hours of the computer lab?', 'Can students access the computer lab during weekends?', 'Is the computer lab open late for students?', 'Are there specific hours for using the computer facilities?', 'What is the schedule for computer lab access?', 'Is the computer lab available during holidays?', 'How long is the computer lab open each day?', 'Are there any restrictions on computer lab usage hours?', 'Can I use the computer lab outside regular class hours?'],
      response: `**Available during College Hours**`
    },

    busFacility: {
      keywords: ['bus facility', 'bus facilities', "bus facility's", 'transport', 'transportation', 'shuttle'],
      response: `Yes , we provide bus facilities covering major routes in the city. For detailed routes and timings, please visit the college.`
    },

    sports: {
      keywords: ['sport', 'sports', 'gym', 'fitness', 'games'],
      response: `⚽ **Sports Facilities:**

• Basketball court
• Cricket ground
• Football field
• Indoor badminton court
• Modern gymnasium
• Table tennis and chess rooms`
    },

    placement: {
      keywords: ['placement', 'placements', 'job', 'jobs', 'recruit'],
      response: `💼 **Placement Statistics:**

• Placement Rate: 92% (2024)
• Highest Package: $120,000/year
• Average Package: $65,000/year`
    },

    Mobile:{
      keywords:['Are mobile phones allowed on campus?', 'What is the policy regarding mobile phone usage on campus?', 'Can students use mobile phones during class hours?', 'Are there designated areas for mobile phone use on campus?', 'Is there a restriction on carrying mobile phones within the campus?', 'How does the institution handle mobile phone distractions?', 'Are mobile phones permitted in the library and study areas?', 'What are the guidelines for mobile phone usage during exams?', 'Can students keep their mobile phones in dormitories?', 'Are there any consequences for violating the mobile phone policy?'],
      response:`Mobile phones are allowed on campus but must be used responsibly. Usage during class hours is restricted to avoid distractions. Designated areas for mobile phone use are provided, and students are expected to adhere to the institution's mobile phone policy to maintain a conducive learning environment.`
    },

    Attendence:{
      keywords:['What is the attendance policy for students?', 'How is attendance tracked and recorded?', 'Are there any consequences for low attendance?', 'What is the minimum attendance requirement to sit for exams?', 'Can students request leave for absences?', 'How does the institution handle attendance for online classes?', 'Is there a system in place for monitoring attendance?', 'What are the guidelines for reporting absences?', 'Are there any incentives for good attendance?', 'How can students improve their attendance record?','Is attendance mandatory?', 'What is the minimum attendance percentage required to appear for exams?', 'Are there any penalties for low attendance?', 'Can students apply for leave in case of unavoidable circumstances?', 'How is attendance monitored during online classes?', 'What is the procedure for reporting absences?', 'Are there any rewards or recognition for students with excellent attendance?', 'How can students track their attendance records?', 'What support is available for students struggling with attendance?', 'Are there specific attendance requirements for different courses or programs?'],
      response:`Students are required to maintain a minimum attendance of 75% to be eligible for exams. Consequences for low attendance may include being barred from exams or other academic activities. Students can request leave for valid reasons.Students are encouraged to communicate any attendance issues with their instructors promptly.`
    },

    companies: {
      keywords: ['company', 'companies', 'recruiter', 'recruiters', 'who recruits'],
      response: `🏢 **Top Recruiters:**

• Google
• Microsoft
• Amazon
• TCS
• Infosys
• Wipro
• Accenture
• Cognizant`
    },

    Admission:{
      keywords: ['final date for admission applications', 'admission last date', 'admission deadline', 'application deadline','When does the admission period close', 'admission cut-off date', 'last date to apply for admission','Could you please specify the last day for admission applications','What is the final date to submit admission applications','When will the merit list be declared','How many rounds of CAP (counseling) are there?'],
      response:`Admissions are closed currently. Please check back next year for the new admission cycle dates.`
    },

    OfflineAdmission:{
      keywords:['Is offline admission available?', 'Can I apply for admission in person?', 'Do you accept walk-in applications for admission?', 'Is there an option for offline admission?', 'How can I apply for admission without using the online portal?', 'Are offline admission forms available?', 'What is the process for offline admission?', 'Can I visit the campus to submit my admission application?', 'Is it possible to apply for admission through postal mail?', 'Do you provide assistance for offline admission applications?'],
      response:`No , we do not offer offline admission. All applications must be submitted through our online portal at admissions.educonnect.edu.`
    },

    DocumentQuery:{
      keywords:['Can I update my documents after submitting the form?', 'Is it possible to change my documents after application submission?', 'What is the procedure for updating documents post-application?', 'Can I modify my submitted documents for admission?', 'How can I correct or update my documents after applying?', 'Are document updates allowed after application submission?', 'What steps should I take to change my documents after applying?', 'Is there a deadline for updating documents post-application?', 'Can I replace incorrect documents after submitting my application?', 'Do you have a process for document updates after application submission?'],
      response:'No, once the application is submitted, documents cannot be updated. Please ensure all documents are accurate before submission.'
    },

    DSYAdmission:{
      keywords:['Can I take direct second-year admission?', 'Is direct second-year admission available?', 'What is the process for DSY admission?', 'How can I apply for direct second-year admission?', 'Are there specific eligibility criteria for DSY admission?', 'What documents are required for DSY admission?', 'Is there a separate application form for DSY admission?', 'Can I transfer credits for DSY admission?', 'What is the deadline for DSY admission applications?', 'Do you offer counseling for DSY admission?'],
      response:'Yes, direct second-year admission (DSY) is available for eligible candidates. but Admissions are closed currently. Please check back next year for the new admission cycle dates.'
    },

    ManagementQuota:{
      keywords:['management quota admission', 'management quota', 'What is the process for management quota admission?', 'Are there specific criteria for management quota admission?', 'How many seats are available under management quota?', 'What documents are required for management quota admission?', 'Is there a separate application form for management quota?'],
      response:'Yes, we do have a management quota for admissions. but Admissions are closed currently. Please check back next year for the new admission cycle dates.'
    },

    Refund:{
      keywords:['What is the refund policy for admissions?', 'How can I request a refund for my admission fee?', 'What is the process for admission fee refund?', 'Are there any deductions on the refund amount?', 'What is the timeline for processing refunds?', 'Can I get a full refund if I withdraw my admission?', 'What documents are required for requesting a refund?', 'Is there a deadline for submitting a refund request?', 'How will I receive my refund?', 'Do you have a specific refund policy for admissions?'],
      response:`Non-refundable.`
    },

    BusFacility:{
      keywords:['bus facility', 'transportation services?', 'What are the bus routes available for students?', 'How can I avail the bus facility?', 'Is there a fee for the bus service?', 'What is the schedule for the bus facility?', 'Are there any safety measures for the bus service?', 'Can I register for the bus facility online?', 'Is the bus facility available for all students?', 'Do you have a specific bus facility for outstation students?','Is there transportation/bus facility available?', 'How can I avail the bus/transportation facility?', 'What are the bus/transportation routes and timings?', 'Is there a fee for the bus/transportation service?', 'Are there any safety measures for the bus/transportation service?', 'Can I register for the bus/transportation facility online?', 'Is the bus/transportation facility available for all students?', 'Do you have a specific bus/transportation facility for outstation students?'],
      response:`Yes, we provide a bus facility for students covering major routes in and around the city. Students can register for the bus service at the beginning of the semester. There is a nominal fee for the service, and safety measures are in place including CCTV surveillance and trained drivers. Detailed routes and timings are available on our website or at the administration office.For fees and routes please contact college administration because they change according to your location`
    },


    contact: {
      keywords: ['contact', 'phone', 'email', 'call', 'reach'],
      response: `📞 **Contact Information:**

Phone: 0257-2212999
Email: info@educonnect.edu
Address: P-51, BSL Road, -Sector, Additional MIDC, Jalgaon, Maharashtra 425003.
Website: www.educonnect.edu
Admissions: admissions@educonnect.edu`
    },

    address: {
      keywords: ['address', 'location', 'where', 'directions'],
      response: `📍 **Address:**

P-51, BSL Road, Sector-M, Additional MIDC, Jalgaon, Maharashtra 425003`
    },

    timings: {
      keywords: ['timing', 'timings', 'time', 'hours', 'office hours'],
      response: `🕐 **Timings:**

Office Hours: Monday-Friday, 10 AM - 5 PM
Saturday & Sunday Closed `
    },
  };

  const findBestMatch = (userInput) => {
    const input = userInput.toLowerCase();

    // 1. Exact phrase match first (most specific)
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.includes(input)) {
        return data.response;
      }
    }

    // 2. Partial match second (fallback)
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => input.includes(keyword.toLowerCase()))) {
        return data.response;
      }
    }

    return `I’m not fully sure about that yet.
Could you try asking the question in a different way?
If you need immediate help, please reach out to the college administration.

Thank you for your patience as the bot is still in trial mode.We will try to update the answers as soon as possible.`;
  };


  // ✅ FIXED: Now includes userName and userEmail
  const saveQueryToBackend = async (sessionId: string, userQuery: string, botResponse: string) => {
    try {
      console.log('💾 Saving query with user info:', {
        userName: user?.name,
        userEmail: user?.email
      });

      const response = await fetch('http://localhost:3001/api/chatbot/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userName: user?.name || 'Anonymous',        // ✅ ADDED
          userEmail: user?.email || '',               // ✅ ADDED
          userQuery,
          botResponse,
          timestamp: new Date(),
          userInfo: {
            ipAddress: '',
            userAgent: navigator.userAgent
          }
        })
      });

      if (response.ok) {
        console.log('✅ Query saved successfully');
      } else {
        console.error('❌ Failed to save query:', await response.text());
      }
    } catch (error) {
      console.error('❌ Error saving query:', error);
    }
  };


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = findBestMatch(input);

      setMessages(prev => [...prev, {
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      }]);

      setIsTyping(false);

      saveQueryToBackend(sessionIdRef.current, userMessage.text, botResponse)
        .then(() => console.log('Saved successfully'))
        .catch(err => console.error(err));
    }, 1000);
  };

  const handleQuickAction = (query) => {
    setInput(query);
    setTimeout(() => {
      handleSend();
      setInput('');
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <GraduationCap className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">EduConnect</h1>
            <p className="text-sm text-blue-100">AI-Powered Inquiry Assistant</p>
          </div>
        </div>
      </div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.type === 'bot' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                {msg.type === 'bot' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={`flex-1 ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`inline-block max-w-xl px-4 py-3 rounded-2xl ${msg.type === 'bot'
                  ? 'bg-white shadow-md'
                  : 'bg-blue-600 text-white'
                  }`}>
                  <p className="whitespace-pre-line text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.type === 'bot' ? 'text-gray-400' : 'text-blue-100'
                    }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white shadow-md px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeInquiryChatbot;
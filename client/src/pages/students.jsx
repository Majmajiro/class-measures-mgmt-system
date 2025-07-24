import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import StudentForm from "../components/students/StudentForm";
import Topbar from "../components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen
} from "lucide-react";
import { api } from "../lib/api";

export default function Students() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) { // Explicitly check for false
      setLocation("/login");
      return;
    }

    if (isAuthenticated === true) { // Only fetch when definitely authenticated
      fetchStudents();
    }
  }, [isAuthenticated, setLocation]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Students data:', data);
      
      const studentsArray = data.students || data.data || data || [];
      setStudents(studentsArray);
      
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth is being determined
  if (isAuthenticated === null || isAuthenticated === undefined) {
    return <div>Loading...</div>;
  }

  // Don't render anything if redirecting to login
  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div>
      <Topbar/>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="p-4">
        <h1 className="text-xl font-bold mb-4">Students ({students.length})</h1>
        
        {loading && <p>Loading students...</p>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}
        
        {!loading && !error && (
          <div>
            <h3 className="font-semibold mb-2">Students Data:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(students, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
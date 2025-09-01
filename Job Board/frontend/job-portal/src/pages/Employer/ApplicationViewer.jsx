import { useState, useEffect, useMemo } from "react";
import {
  Users,
  MapPin,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const ApplicationViewer = () => {
  const { jobId } = useParams();   //  Get jobId from URL
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId)
      );
      setApplications(response.data);
    } catch (err) {
      console.log("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    } else {
      navigate("/manage-jobs");
    }
  }, [jobId]);

  // Group applications by job
  const groupedApplications = useMemo(() => {
    return applications.reduce((acc, app) => {
      const jId = app.job._id;
      if (!acc[jId]) {
        acc[jId] = {
          job: app.job,
          applications: [],
        };
      }
      acc[jId].applications.push(app);
      return acc;
    }, {});
  }, [applications]);

  const handleDownloadResume = (resumeUrl) => {
    window.open(resumeUrl, "_blank");
  };

  return (
    <DashboardLayout activeMenu="manage-jobs">
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-gray-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => navigate("/manage-jobs")}
              className="group flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back</span>
            </button>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 justify-center">
              Applications Overview
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 pb-8">
        {Object.keys(groupedApplications).length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <Users className="mx-auto h-24 w-24 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No applications available
            </h3>
            <p className="mt-2 text-gray-500">
              No applications found at the moment.
            </p>
          </div>
        ) : (
          // Applications by Job
          <div className="space-y-8">
            {Object.values(groupedApplications).map(({ job, applications }) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Job Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-blue-100">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm">{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{job.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                      <span className="text-sm text-white font-medium">
                        {applications.length} Application
                        {applications.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicationViewer;

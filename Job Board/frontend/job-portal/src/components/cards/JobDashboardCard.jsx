import { Briefcase } from "lucide-react";
import moment from "moment";

const JobDashboardCard = ({job}) => {
  return (
    <div className="">
      <div className="">
        <div className="">
          <Briefcase className="" />
        </div>
        <div>
          <h4 className="">{job.title}</h4>
          <p className="">
            {job.location} · {moment(job.createdAt)?.format("Do MM YYYY")}
          </p>
        </div>
      </div>
      <div className="">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full  ${
            job.isClosed
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {job.isClosed ? "Closed" : "Active"}
        </span>
      </div>
    </div>
  );
};

export default JobDashboardCard;
import { Clock } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
return (
  <div className="">
    <div className="">
      <span className="">
        {applicant.name
          .split(" ")
          .map(n => n[0])
          .join("")}
      </span>
    </div>
    <div>
      <h4 className="">{applicant.name}</h4>
      <p className="">{position}</p>
    </div>
    <div className="">
      <Clock className="" />
      {time}
    </div>
  </div>
)
};

export default ApplicantDashboardCard;

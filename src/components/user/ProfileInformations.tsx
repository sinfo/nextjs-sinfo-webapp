import GridList from "@/components/GridList";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import AcademicTile from "./AcademicTile";

interface ProfileInformationProps {
  user: User;
}

export default function ProfileInformations({ user }: ProfileInformationProps) {
  const skills = user.skills;
  const interestedIn = user.interestedIn;
  const lookingFor = user.lookingFor;
  const academicInformation = user.academicInformation;

  return (
    <>
      {/* Academic Information */}
      {!!academicInformation?.length && (
        <List title="Academic Information">
          {academicInformation.map((info, idx) => (
            <AcademicTile key={`academic-information-${idx}`} {...info} />
          ))}
        </List>
      )}

      {/* Skills */}
      {!!skills?.length && (
        <GridList title="Skills">
          {skills.map((skill, idx) => (
            <span
              key={`skills-${idx}`}
              className="text-sm flex text-center items-center py-1 px-4 bg-sinfo-quaternary text-white rounded-md shadow-md"
            >
              {skill}
            </span>
          ))}
        </GridList>
      )}

      {/* Interested In */}
      {!!interestedIn?.length && (
        <GridList title="Interested In">
          {interestedIn.map((interest, idx) => (
            <span
              key={`interested-in-${idx}`}
              className="text-sm flex text-center items-center py-1 px-4 bg-sinfo-tertiary text-white rounded-md shadow-md"
            >
              {interest}
            </span>
          ))}
        </GridList>
      )}

      {/* Looking For */}
      {!!lookingFor?.length && (
        <GridList title="Looking for">
          {lookingFor.map((looking, idx) => (
            <span
              key={`looking-for-${idx}`}
              className="text-sm flex text-center items-center py-1 px-4 bg-sinfo-secondary text-white rounded-md shadow-md"
            >
              {looking}
            </span>
          ))}
        </GridList>
      )}
    </>
  );
}

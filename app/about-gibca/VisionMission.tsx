import './VisionMission.css';

interface VisionMissionProps {
  visionTitle: string;
  visionDescription: string;
  missionTitle: string;
  missionDescription: string;
}

const VisionMission = ({
  visionTitle,
  visionDescription,
  missionTitle,
  missionDescription,
}: VisionMissionProps) => {
  return (
    <div className="cardContainer">
      <div className="infoCard">
        <h3>{visionTitle}</h3>
        <p>{visionDescription}</p>
      </div>
      <div className="infoCard">
        <h3>{missionTitle}</h3>
        <p>{missionDescription}</p>
      </div>
    </div>
  );
};

export default VisionMission;

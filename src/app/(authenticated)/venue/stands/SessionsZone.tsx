const SessionsStands = () => {
  return (
    <g id="sessions">
      {/* Main Rooms */}
      <g id="rooms">
        {/* Auditorium */}
        <a href="/schedule?place=Auditorium">
          <g id="auditorium">
            <rect
              x="51.5"
              y="12"
              width="204.7"
              height="109"
              fill="white"
              stroke="black"
              strokeWidth="1.5"
            />
            <text x="120" y="69" fontSize="13">
              Auditorium
            </text>
          </g>
        </a>

        {/* Room 1 */}
        <a href="/schedule?place=Room 1">
          <g id="room1">
            <rect
              x="254.9"
              y="12"
              width="65"
              height="109"
              fill="white"
              stroke="black"
              strokeWidth="1.5"
            />
            <text x="264" y="69" fontSize="13">
              Room 1
            </text>
          </g>
        </a>

        {/* Room 2 */}
        <a href="/schedule?place=Room 2">
          <g id="room2">
            <rect
              x="358.8"
              y="12"
              width="65"
              height="109"
              fill="white"
              stroke="black"
              strokeWidth="1.5"
            />
            <text x="366" y="69" fontSize="13">
              Room 2
            </text>
          </g>
        </a>
      </g>

      {/* 2nd Stage */}
      <g id="secondStage">
        <rect
          x="363.3"
          y="290.2"
          width="35.9"
          height="54.4"
          fill="white"
          stroke="black"
          strokeWidth="1.5"
        />
        <text x="368" y="318" fontSize="13" transform="rotate(90 383 320)">
          2nd
        </text>
        <text x="363" y="332" fontSize="13" transform="rotate(90 383 320)">
          stage
        </text>
      </g>
    </g>
  );
};

export default SessionsStands;

const CoworkingZone = () => {
  return (
    <g id="zones">
      {/* Startup Zone */}
      <g id="startup">
        <rect
          x="86.3"
          y="270.3"
          width="82.1"
          height="92.2"
          fill="none"
          stroke="black"
          strokeWidth="1.5"
          strokeDasharray="3,5"
        />
        <text x="104" y="310" fontSize="13">
          Startup
        </text>
        <text x="112" y="325" fontSize="13">
          zone
        </text>
      </g>

      {/* Gaming Zone */}
      <g id="gaming">
        <rect
          x="168.4"
          y="270.3"
          width="101.7"
          height="92.2"
          fill="none"
          stroke="black"
          strokeWidth="1.5"
          strokeDasharray="3,5"
        />
        <text x="193" y="310" fontSize="13">
          Gaming
        </text>
        <text x="202" y="325" fontSize="13">
          zone
        </text>
      </g>

      {/* Lounge Zone */}
      <g id="lounge">
        <rect
          x="270.1"
          y="270.3"
          width="93.6"
          height="92.2"
          fill="none"
          stroke="black"
          strokeWidth="1.5"
          strokeDasharray="3,5"
        />
        <text x="293" y="319" fontSize="13">
          Lounge
        </text>
      </g>
    </g>
  );
};

export default CoworkingZone;

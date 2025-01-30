const FoodZone = () => {
  return (
    <g id="food">
      {/* Breakfast Zone */}
      <g id="breakfast">
        <text x="336" y="18" fontSize="13" transform="rotate(90 336 18)">
          Breakfast Zone
        </text>
      </g>

      {/* Coffee Break */}
      <g id="coffee">
        <rect
          x="424"
          y="12"
          width="65"
          height="109"
          fill="white"
          stroke="black"
          strokeWidth="1.5"
        />
        <text x="452" y="21" fontSize="13" transform="rotate(90 450 24)">
          Coffee-break
        </text>
      </g>
    </g>
  );
};

export default FoodZone;

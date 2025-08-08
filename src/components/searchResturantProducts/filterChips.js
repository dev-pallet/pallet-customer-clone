import React from "react";
import { Box, Chip, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import GrassIcon from "@mui/icons-material/Grass";
import VisibilityIcon from "@mui/icons-material/Visibility";
// const iconMap = {
//   NON_VEG: <VisibilityOffIcon sx={{ fontSize: 13 }} color={"#b55858"} />,
//   VEG: <VisibilityOffIcon sx={{ fontSize: 13 }} color={"#b55858"} />,
//   VEGAN: <GrassIcon sx={{ fontSize: 13 }} color={"#b55858"} />,
//   spicy: <WhatshotIcon sx={{ fontSize: 13, color: "#b55858" }} />,
//   nonSpicy: <AcUnitIcon sx={{ fontSize: 13, color: "#b55858" }} />,
//   // priceLowHigh: <ArrowDownwardIcon sx={{ fontSize: 18 }} />,
//   // priceHighLow: <ArrowUpwardIcon sx={{ fontSize: 18 }} />,
//   // highlyReordered: <LoopIcon sx={{ fontSize: 18 }} />,
// };
const FilterChips = ({
  filters,
  onRemove,
  onFilterClick,
  onChipClick,
  filtersState,
}) => {
  const appliedFiltersCount = filters?.length;

  const getFilterIcon = (key, isActive) => {
    switch (key) {
      case "VEG":
      case "NON_VEG":
        return isActive ? (
          <VisibilityIcon sx={{ fontSize: 13 }} color={"#b55858"} />
        ) : (
          <VisibilityOffIcon sx={{ fontSize: 13 }} color={"#b55858"} />
        );
      case "VEGAN":
        return <GrassIcon sx={{ fontSize: 13 }} color={"#b55858"} />;
      default:
        return null;
    }
  };

  const filterOptions = [
    { key: "VEG", label: "Veg" },
    { key: "NON_VEG", label: "Non Veg" },
    { key: "VEGAN", label: "Vegan" },
    // { key: "spicy", label: "Spicy" },
    // { key: "nonSpicy", label: "Non Spicy" },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        overflowX: "auto",
        gap: 0.5,
        px: 2,
        py: 1,
        // backgroundColor: "#f8f8f8",
      }}
    >
      <Button
        // onClick={onFilterClick}
        variant={appliedFiltersCount ? "contained" : "outlined"}
        startIcon={<TuneIcon />}
        sx={{
          borderRadius: 2,
          whiteSpace: "nowrap",
          backgroundColor: appliedFiltersCount ? "#ffe6ec" : "#fae6e6",
          minWidth: "100px",
          fontSize: "10px",
          border: "1px solid rgb(210 25 31 / 50%)",
          color: "#d21919",
        }}
      >
        Filters {appliedFiltersCount > 0 ? `(${appliedFiltersCount})` : ""}
      </Button>

      {filterOptions?.map((filter) => {
        return (
          <Chip
            key={filter?.key}
            label={filter?.label}
            // icon={iconMap[filter?.key]}
            icon={getFilterIcon(filter?.key, filtersState?.[filter?.key])}
            onClick={() => onChipClick(filter?.key)}
            sx={{
              borderRadius: 2,
              backgroundColor: filtersState[filter?.key]
                ? "#f7dddd !important"
                : "#fff",
              color: "#b55858",
              fontWeight: 500,
              fontSize: "10px",
              border: filtersState[filter?.key]
                ? "2px solid rgb(188, 38, 38)"
                : "1px solid #ccc",
            }}
          />
        );
      })}
    </Box>
  );
};

export default FilterChips;

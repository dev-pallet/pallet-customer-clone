// components/FiltersDrawer.js
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import BottomDrawer from "../drawer";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

const FiltersDrawer = ({
  open,
  setDrawerOpen,
  filtersState,
  setFiltersState,
}) => {
  //changes on filter state
  const toggleFilter = (key) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const clearAll = () => {
    const resetFilters = Object.keys(filtersState)?.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setFiltersState(resetFilters);
  };

  return (
    <BottomDrawer
      drawerStateProp={open}
      setDrawerStateProp={setDrawerOpen}
      customCloseIcon={
        <CancelPresentationIcon
          sx={{ color: "black", backgroundColor: "white" }}
        />
      }
      drawerContentStyle={{ marginBottom: "50px" }}
      drawerContent={
        <Box sx={{ px: 3, pt: 2, pb: 6 }}>
          <Typography variant="h6">Filters and Sorting</Typography>

          <Box mt={2}>
            <Typography fontWeight="bold">Sort by</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtersState?.priceLowHigh}
                  onChange={() => toggleFilter("priceLowHigh")}
                />
              }
              label="Price - low to high"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtersState?.priceHighLow}
                  onChange={() => toggleFilter("priceHighLow")}
                />
              }
              label="Price - high to low"
            />
          </Box>

          <Box mt={2}>
            <Typography fontWeight="bold">Veg/Non-veg</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtersState?.hideNonVeg}
                  onChange={() => toggleFilter("hideNonVeg")}
                />
              }
              label="Hide non-veg"
            />
          </Box>

          <Box mt={2}>
            <Typography fontWeight="bold">Top Picks</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtersState?.highlyReordered}
                  onChange={() => toggleFilter("highlyReordered")}
                />
              }
              label="Highly reordered"
            />
          </Box>

          <Box mt={2}>
            <Typography fontWeight="bold">Dietary Preference</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtersState?.spicy}
                  onChange={() => toggleFilter("spicy")}
                />
              }
              label="Spicy"
            />
          </Box>

          <Box mt={2}>
            <Typography fontWeight="bold">Dietary Preference</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtersState?.nonSpicy}
                  onChange={() => toggleFilter("nonSpicy")}
                />
              }
              label="Non-Spicy"
            />
          </Box>

          <Box mt={2}>
            <Typography fontWeight="bold">Dietary Preference</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtersState?.vegan}
                  onChange={() => toggleFilter("vegan")}
                />
              }
              label="Vegan"
            />
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button onClick={clearAll} color="secondary">
              Clear All
            </Button>
            <Button variant="contained" onClick={() => setDrawerOpen(false)}>
              Apply
            </Button>
          </Box>
        </Box>
      }
    />
  );
};

export default FiltersDrawer;

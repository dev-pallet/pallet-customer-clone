import { useEffect, useState } from "react";
import { useSnackbar } from "./SnackbarProvider";
import { useSelector } from "react-redux";
import { getNearByStore } from "../redux/reducers/locationReducer";
import { fetchTags } from "../config/services/catalogService";

const useTagsList = () => {
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tagId, setTagId] = useState(null);
  const showSnackbar = useSnackbar();
  const nearByStore = useSelector(getNearByStore);

  const getTagsList = async () => {
    try {
      setLoading(true);

      if (nearByStore?.id) {
        const payload = {
          orgIds: [String(nearByStore?.id)],
          locationIds: [String(nearByStore?.locId)],
          tagIds: tagId,
          sort: {
            creationDateSortOption: "DEFAULT",
            tagPriority: "DEFAULT",
          },
        };

        const res = await fetchTags(payload);
        if (res?.data?.status === "SUCCESS") {
          const tagDataArray = res?.data?.data?.data?.data || [];
          const temp = tagDataArray?.map((e) => ({
            tagName: e?.tagName,
            gtins: e?.gtins,
            tagIds: e?.tagId,
          }));
          if (Array.isArray(tagDataArray)) {
            setTagsList(temp);
          }
        }
      }
    } catch (e) {
      showSnackbar(
        e?.message || e?.response?.data?.message || "Failed to fetch tags",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTagsList();
  }, [nearByStore, tagId]);

  return { tagsList, loading, setTagId };
};

export default useTagsList;

// react 
import React from "react";
// components 
import OrderedItemsCard from "./orderedItemsCard";

export default function OrderedItems({ items }) {
  return (
    <>
      {
        items?.map((item) => <OrderedItemsCard data={item} key={item?.gtin} />
        )}
    </>
  );
}

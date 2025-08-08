export default function handleBannerNavigation(url, navigation) {
  if (!url) return;

  const path = url?.replace("webApp://", "");
  const parts = path.split("/");

  const [source, routeName, identifier] = parts;

  switch (routeName) {
    case "product-details":
      if (identifier) {
        navigation(`/product-listing/tags/${identifier}`);
      }
      break;

    // future support for categories
    // case "allProducts":
    //   if (identifier) {
    //     navigate(`/allProducts/${identifier}`);
    //   }
    //   break;

    default:
      console.warn("Unknown route:", routeName);
  }
}

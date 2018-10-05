export default function getImage(meal: Object): {uri: ?string} {
  let uri = meal.strMealThumb;
  return uri ? { uri } : null;
}

export async function getPlants() {
  const res = await fetch("http://localhost:8080/api/plants");
  return await res.json();
}
import MapView from "../components/MapView";

export const metadata = {
  title: "Salonify",
  description: "Find the best salons near you with Salonify! I love pookies!",
  openGraph: {
    title: "Salonify",
    description: "Find the best salons near you with Salonify! I love pookies!",
    images: ["/imgs/logo.png"], // ✅ put it in public folder
    type: "website",
  },
};

export default function Page() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Salonify</h1>
      <MapView />
    </main>
  );
}

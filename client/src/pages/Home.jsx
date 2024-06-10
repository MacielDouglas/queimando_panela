import Loading from "../helper/Loading";
export default function Home() {
  const loading = false;
  return (
    <div className="bg-orange-100">
      <h1>Home</h1>
      {loading && <Loading />}
    </div>
  );
}

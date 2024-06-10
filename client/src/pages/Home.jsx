import Loading from "../helper/Loading";
export default function Home() {
  const loading = true;
  return (
    <div>
      <h1>Home</h1>
      {loading && <Loading />}
    </div>
  );
}

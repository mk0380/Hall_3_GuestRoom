const Loader = () => {
  return (
    <div id="fountainG">
      {[...Array(8)]?.map((_, i) => {
        return <div id={`fountainG_${i + 1}`} key={i+1} className="fountainG"></div>;
      })}
    </div>
  );
};

export default Loader;

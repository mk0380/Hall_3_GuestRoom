"use client";

const IframeLoader = ({ pdf_link, loading, setLoading }) => {

  
  return (
    <iframe
      src={pdf_link}
      onLoad={() => setLoading(false)}
      style={{
        display: loading ? "none" : "block",
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default IframeLoader;

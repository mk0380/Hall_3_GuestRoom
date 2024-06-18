import HomeButtons from "@/components/homeButtons";
import Heading from "@/components/heading";
import {
  ameneties_heading,
  ameneties_sub_heading,
  rules_heading,
  rules_sub_heading,
} from "@/important_data/important_data";

const Home = () => {
  const style = {
    fontSize: "1.1rem",
    marginTop: "1.2rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  };

  return (
    <div className="home">
      <div className="container">
        <Heading />
        <div className="boxes">
          <div className="box1">
            <h4>Amenities</h4>
            <p style={style}>{ameneties_heading}</p>
            <ul>
              {ameneties_sub_heading.map((data, indx) => (
                <li key={indx}>{data}</li>
              ))}
            </ul>
          </div>
          <div className="box1">
            <h4>Rules of Guest Room</h4>
            <p style={style}>{rules_heading}</p>
            <ul>
              {rules_sub_heading.map((data, indx) => (
                <li key={indx}>{data}</li>
              ))}
            </ul>
          </div>
        </div>
        <HomeButtons />
      </div>
    </div>
  );
};

export default Home;

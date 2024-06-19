import { Button, IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { room_details, rooms_booked, rooms_reserved, rooms_vacant} from "@/important_data/important_data";

const LazyCheckDates = ({
  display,
  routing,
  setDatesState,
  room,
  colorList,
  datesColor,
  datesState
}) => {
  const colorListIcons = [
    {
      text: "Vacant",
      title: rooms_vacant,
      class: "green",
    },
    {
      text: "Booked",
      title: rooms_booked,
      class: "red",
    },
    {
      text: "Reserved",
      title: rooms_reserved,
      class: "yellow",
    },
  ];

  const checkCanBeSelected = (index) => {
    for (let row = 0; row < datesColor.length; row++) {
      if (colorList[row][index] == "0" || colorList[row][index] == "-1") {
        return true;
      }
    }
    return false;
  };

  const getUniqueRooms = (rooms) => {
    const uniqueRoomsMap = new Map();
  
    rooms.forEach(room => {
      const key = `${room.code}-${room.beds}`;
      if (!uniqueRoomsMap.has(key)) {
        uniqueRoomsMap.set(key, room);
      }
    });
  
    return Array.from(uniqueRoomsMap.values());
  };

  return (
    <>
      {display && (
        <div className="colorCodes">
          <h5>Color Codes</h5>
          <div className="color_list">
            {colorListIcons?.map((data, indx) => {
              return (
                <div className="box_color" key={indx}>
                  <div className={data.class}></div>
                  {data.text}
                  <Tooltip title={data.title} arrow>
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            })}
          </div>

          <h5>Rooms Size</h5>
          <div className="room_size">
            {
            getUniqueRooms(room_details)?.map((data, indx) => {
              return (
                <p key={indx}>
                  {data.code} - {data.beds}
                </p>
              );
            })}
          </div>
        </div>
      )}
      {display && (
        <div className="result">
          <h5>Rooms Availability Status</h5>

          <div className="overall">
            <div className="columns">
              <div className="date" style={{ fontWeight: "bolder" }}>
                Select
              </div>

              {room_details?.map((data, indx) => {
                return (
                  <input
                    type="radio"
                    key={indx}
                    value={data.no + " " + data.code}
                    disabled={checkCanBeSelected(indx) ?? true}
                    name="option"
                    onClick={(ev) =>
                      setDatesState({ ...datesState, room: ev.target.value })
                    }
                  />
                );
              })}
            </div>

            <div className="columns">
              <div className="date" style={{ fontWeight: "bolder" }}>
                RoomNo
              </div>

              {room_details?.map((data, indx) => {
                return <label key={indx}>{data.no + " " + data.code}</label>;
              })}
            </div>

            {[...Array(datesColor?.length ?? 0)]?.map((_, i) => (
              <div className="columns" key={i}>
                <div className="date" style={{ fontWeight: "bolder" }}>
                  {datesColor[i]}
                </div>

                {[...Array(room_details?.length)]?.map((_, indx) => {
                  return (
                    <div
                      key={indx}
                      className={
                        "" +
                        (colorList[i][indx] === "1"
                          ? "green1 room"
                          : colorList[i][indx] === "-1"
                          ? "red1 room"
                          : colorList[i][indx] === "0"
                          ? "yellow1 room"
                          : "black1 room")
                      }
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      {display && (
        <div className="book_btn">
          <Button
            variant="outlined"
            className="btn btns"
            disabled={(room?.length ?? 0) === 0}
            onClick={routing}
          >
            Book selected rooms
          </Button>
        </div>
      )}
    </>
  );
};

export default LazyCheckDates;

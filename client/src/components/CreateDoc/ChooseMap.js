import { useEffect, useRef, useState } from "react";
import Postcode from "react-daum-postcode";

const { kakao } = window;

const ChooseMap = ({ inputValue, setInputValue }) => {
  const container = useRef(null);
  const addr = useRef(null);

  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    let data = inputValue.place.split("|");
    const location = new kakao.maps.LatLng(data[0], data[1]);
    let map = new kakao.maps.Map(container.current, {
        center: location,
      }),
      marker = new kakao.maps.Marker({
        map,
        position: location,
      }),
      infowindow = new kakao.maps.InfoWindow({
        map,
        position: new kakao.maps.LatLng(Number(data[0]) + 0.0004, data[1]),
        content: `<div class="map--infowindow">${
          data[3] === "null" ? data[2] : data[3]
        }</div>`,
        removable: true,
      });
  }, [inputValue.place]);

  // '위도|경도|주소|빌딩이름|리스트에서 보일 주소'
  const addrFinder = (data) => {
    const geocoder = new kakao.maps.services.Geocoder();
    addr.current.textContent = data.address;
    console.log("data", data);
    geocoder.addressSearch(data.address, (result, status) => {
      if (status === "OK") {
        console.log(result[0]);
        const lat = result[0].y;
        const lng = result[0].x;
        const place = result[0].road_address.address_name;
        const building = result[0].road_address.building_name || "null";
        const region = `${result[0].road_address.region_1depth_name} ${result[0].road_address.region_2depth_name} ${result[0].road_address.region_3depth_name}`;
        setInputValue({
          ...inputValue,
          place: `${lat}|${lng}|${place}|${building}|${region}`,
        });
      }
    });
  };

  return (
    <div className="post--map--container">
      <div className="post--map--input--container">
        <div className="post--address" ref={addr}></div>
        <button
          onClick={() => {
            setIsOn(true);
          }}
        >
          주소찾기
        </button>
      </div>
      {isOn ? (
        <div
          className="modal--backdrop"
          onClick={() => {
            setIsOn(false);
          }}
        >
          <div className="modal--view postcode">
            <Postcode
              onComplete={(data) => {
                addrFinder(data);
                setIsOn(false);
              }}
              className="post--map--postcode"
            />
          </div>
        </div>
      ) : null}

      <div className="post--map" ref={container} />
    </div>
  );
};

export default ChooseMap;

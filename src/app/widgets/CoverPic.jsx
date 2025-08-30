"use client";
import React from "react";
import { apiroot3 } from "../apiroot";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function CoverPic({ id, display }) {
  const [isLoaded,setIsLoaded] = React.useState(false);
  let url = apiroot3 + `/maichart/${id}/image`;
  let urlfull = apiroot3 + `/maichart/${id}/image?fullImage=true`;
  let idDisplay = null;
  if (display) {
    idDisplay = <div className="songId">{display}</div>;
  }

  return (
    <>
      <PhotoProvider
        bannerVisible={false}
        loadingElement={<div className="loading"></div>}
      >
        <PhotoView src={urlfull}>
          <img className= {"songImg " + (isLoaded ? " loadedImg" :" loadingImg")} loading="lazy" src={url} alt="" 
          onLoad={() =>setIsLoaded(true)} />
        </PhotoView>
      </PhotoProvider>
      {idDisplay}
    </>
  );
}

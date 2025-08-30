"use client";
import React from "react";

export default class AdComponent extends React.Component {
  componentDidMount() {
    if (window.adsbygoogle && !window.adsbygoogle.loaded) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }

  render() {
    return (
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-d9+97-36-cl+yp"
        data-ad-client="ca-pub-7973799234411834"
        data-ad-slot="8735501370"
      >
      </ins>
    );
  }
}

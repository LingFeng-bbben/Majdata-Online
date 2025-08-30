"use client";
import React from "react";

/**
 * Renders a level number.
 * @param {string} level The level string, which usually contains a number and an optional plus sign after that.
 * @returns JSX.Element
 */
export function renderLevel(level) {
  if (level.endsWith("+")) {
    return (
      <>
        {level.substring(0, level.length - 1)}
        <sup>+</sup>
      </>
    );
  } else {
    return <>{level}</>;
  }
}

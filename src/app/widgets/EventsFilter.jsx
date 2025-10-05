import React from "react";
import { loc } from "../utils";

const EventsFilter = ({ selectedCategory, onCategoryChange, categories }) => {
  // 获取category的翻译
  const getCategoryTranslation = (category) => {
    const categoryMap = {
      "高校赛事": loc("EventCategoryUniversity"),
      "大型赛事": loc("EventCategoryMajor"),
      "私立企划": loc("EventCategoryPrivateProject"),
      "私立赛事": loc("EventCategoryPrivateContest")
    };
    return categoryMap[category] || category;
  };

  const allText = loc("FilterAll");

  return (
    <div className="events-filter">
      <div className="filter-label">{loc("FilterEventTypes")}</div>
      <div className="filter-buttons">
        <button
          className={`filter-button ${selectedCategory === allText ? "active" : ""}`}
          onClick={() => onCategoryChange(allText)}
        >
          {allText}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-button ${selectedCategory === category ? "active" : ""}`}
            onClick={() => onCategoryChange(category)}
          >
            {getCategoryTranslation(category)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventsFilter;

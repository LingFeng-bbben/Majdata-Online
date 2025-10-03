import React from "react";

const EventsFilter = ({ selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className="events-filter">
      <div className="filter-label">活动类型：</div>
      <div className="filter-buttons">
        <button
          className={`filter-button ${selectedCategory === "全部" ? "active" : ""}`}
          onClick={() => onCategoryChange("全部")}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-button ${selectedCategory === category ? "active" : ""}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventsFilter;

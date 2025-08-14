// 完整的活动数据定义 - 作为唯一数据源
const eventsData = [
  { 
    id: "soty2024",
    href: "/space?id=dilei", 
    src: "/event2.jpg", 
    alt: "地雷杯",
    title: "地雷杯",
    category: "私立赛事",
    createDate: "2025-08-14", // 活动创建的精确日期
    description: "这是香菜举办的MMFC赛制式雷亚歌曲主题的maimai写谱比赛。",
    featured: true, // 标记为首页推荐
    priority: 1 // 首页显示优先级
  },
  { 
    id: "unchained",
    href: "/space?id=海鲜杯", 
    src: "/event3.jpg", 
    alt: "海鲜杯",
    title: "海鲜杯", 
    category: "私立赛事",
    createDate: "2025-08-01", // 活动创建的精确日期
    description: "vocaloid主体个人比赛 by 甘党水母",
    featured: true, // 标记为首页推荐
    priority: 2 // 首页显示优先级
  },
  { 
    id: "mmfc11",
    href: "https://www.bilibili.com/video/BV1e2RzYjECa/", 
    src: "/mmfc_event.jpg", 
    alt: "MMFC11结算",
    title: "MMFC11结算", 
    category: "大型赛事",
    createDate: "2025-04-06", // 结算日期
    description: "第11届舞萌自制月赛（MMFC11）结算，详情请见B站视频。",
    featured: false
  },


  { 
    id: "mmfc10",
    href: "https://www.bilibili.com/video/BV1EKScYaEpi/", 
    src: "/mmfc_event.jpg", 
    alt: "MMFC10结算",
    title: "MMFC10结算", 
    category: "大型赛事",
    createDate: "2024-11-20", // 结算日期
    description: "第10届舞萌自制月赛（MMFC10）结算，详情请见B站视频。",
    featured: false
  },

  { 
    id: "mmfc9",
    href: "https://www.bilibili.com/video/BV1jH4y1c7xP/", 
    src: "/mmfc_event.jpg", 
    alt: "MMFC9结算",
    title: "MMFC9结算", 
    category: "大型赛事",
    createDate: "2024-07-27", // 结算日期
    description: "第9届舞萌自制月赛（MMFC9）结算，详情请见B站视频。",
    featured: false
  }
];

// 获取所有活动数据
export function getAllEvents() {
  return eventsData;
}

// 获取首页推荐活动（按优先级排序）
export function getFeaturedEvents(limit = 2) {
  return eventsData
    .filter(event => event.featured)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
    .slice(0, limit);
}

// 获取活动总数
export function getEventsCount() {
  return eventsData.length;
}

// 获取未在首页显示的活动数量
export function getNonFeaturedEventsCount() {
  return eventsData.filter(event => !event.featured).length;
}

// 根据ID获取单个活动
export function getEventById(id) {
  return eventsData.find(event => event.id === id);
}

// 智能计算时间差距（多少天前）
export function getTimeAgo(createDate) {
  const eventDate = new Date(createDate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - eventDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) {
    return "今天";
  } else if (diffDays === 1) {
    return "1天前";
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}个月前`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years}年前`;
  }
}

// 获取带智能时间显示的活动数据
export function getEventsWithTimeAgo() {
  return eventsData.map(event => ({
    ...event,
    timeAgo: getTimeAgo(event.createDate),
    createDateFormatted: new Date(event.createDate).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }));
}

// 获取首页推荐活动（带智能时间）
export function getFeaturedEventsWithTime(limit = 2) {
  const eventsWithTime = getEventsWithTimeAgo();
  return eventsWithTime
    .filter(event => event.featured)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
    .slice(0, limit);
}

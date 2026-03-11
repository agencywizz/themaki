import { Review } from "./types";

export const REVIEWS: readonly Review[] = [
  {
    id: "review-1",
    author: "Thays Rodrigues",
    rating: 5,
    text: "Absolutely amazing sushi! The salmon rolls were so fresh and beautifully presented. Best Japanese food in Roscommon by far.",
    date: "2025-11-15",
  },
  {
    id: "review-2",
    author: "Warwick Tours Switzerland",
    rating: 5,
    text: "We stopped by during our Ireland trip and were blown away. The Chef's Special platter was outstanding. Highly recommend!",
    date: "2025-10-22",
  },
  {
    id: "review-3",
    author: "Grainne C",
    rating: 4,
    text: "Lovely food and great atmosphere. The gyoza are a must-try! Will definitely be coming back for the maki combo.",
    date: "2025-12-03",
  },
] as const;

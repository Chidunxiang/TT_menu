export type CategoryKey = "entre" | "carb" | "healthy" | "soup" | "drink";

export const CATEGORIES: { key: CategoryKey; label: string; icon: string }[] = [
  { key: "entre", label: "Entre", icon: "restaurant" },
  { key: "carb", label: "Carb", icon: "rice_bowl" },
  { key: "healthy", label: "Healthy", icon: "spa" },
  { key: "soup", label: "Soup", icon: "soup_kitchen" },
  { key: "drink", label: "Drink", icon: "local_bar" },
];

export type MenuItem = {
  id: string;
  category: CategoryKey;
  title: string;
  desc: string;
  price: number;
  imageUrl: string;
  badge?: "POPULAR" | "SPICY";
};

export const MENU: MenuItem[] = [
  {
    id: "poke",
    category: "entre",
    title: "Rainbow Poke Bowl",
    desc: "Fresh salmon, avocado, cucumber, edamame, and corn served over sushi rice.",
    price: Infinity,
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
    badge: "POPULAR",
  },
  {
    id: "chicken",
    category: "entre",
    title: "Herb Chicken Plate",
    desc: "Grilled herb chicken breast with roasted veggies and quinoa.",
    price: Infinity,
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80",
  },
  {
    id: "beef",
    category: "entre",
    title: "Sichuan Beef",
    desc: "Tender beef slices stir-fried with chili peppers and scallions.",
    price: Infinity,
    imageUrl:
      "https://images.unsplash.com/photo-1604908176997-125f25cc500f?w=1200&q=80",
    badge: "SPICY",
  },
];
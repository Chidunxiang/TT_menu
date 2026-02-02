export type CategoryKey = "entre" | "carb" | "healthy" | "soup" | "drink" | "desert";

export const CATEGORIES: { key: CategoryKey; label: string; icon: string }[] = [
  { key: "entre", label: "Entre", icon: "restaurant" },
  { key: "carb", label: "Carb", icon: "rice_bowl" },
  { key: "healthy", label: "Healthy", icon: "spa" },
  { key: "soup", label: "Soup", icon: "soup_kitchen" },
  { key: "drink", label: "Drink", icon: "local_bar" },
  { key: "desert", label: "Desert", icon: "icecream" },
];

export type MenuItem = {
  id: string;
  category: CategoryKey;
  title: string;
  desc: string;
  price: number;
  imageUrl: string;
badge?: "POPULAR" | "SPICY" | "少油" | "Chef's favorite" | "能吃" | "感觉吃不饱";
};

export const MENU: MenuItem[] = [
  {
    id: "poke",
    category: "entre",
    title: "糖醋排骨",
    desc: "好吃，香，但是小胖",
    price: Infinity,
    imageUrl:
      "糖醋排骨.jpg",
    badge: "POPULAR",
  },
  {
    id: "chicken",
    category: "entre",
    title: "西红柿炒鸡蛋",
    desc: "你可以点两份 大b象将为您炒5个蛋",
    price: Infinity,
    imageUrl:
      "西红柿鸡蛋.jpg",
  },
  {
    id: "beef",
    category: "entre",
    title: "清炒西葫芦",
    desc: "健康，可以放心吃",
    price: Infinity,
    imageUrl:
      "清炒西葫芦.jpg",
    badge: "少油",
  },
  {
    id: "kelejichi",
    category: "entre",
    title: "可乐鸡翅",
    desc: "胖，少吃，当然点的话我也是会做滴",
    price: Infinity,
    imageUrl:
      "可乐鸡翅.jpg",
    badge: "POPULAR",
  },
  {
    id: "lajiaochaorou",
    category: "entre",
    title: "辣椒炒肉",
    desc: "小胖小胖，可吃可吃",
    price: Infinity,
    imageUrl:
      "辣椒炒肉.jpg",
    
  },

//   {
//     id: "mifan",
//     category: "carb",
//     title: "米饭",
//     desc: "纯碳水，香，建议搭配糖续排骨可乐鸡翅",
//     price: Infinity,
//     imageUrl:
//       "米饭.jpg",
    
//   },
  {
    id: "digua",
    category: "carb",
    title: "烤地瓜",
    desc: "没啥技术含量取决于地瓜品质",
    price: Infinity,
    imageUrl:
      "烤地瓜.jpg",

  },
  {
    id: "yanmai",
    category: "carb",
    title: "燕麦",
    desc: "不好吃不好吃不好吃，慎重！！！",
    price: Infinity,
    imageUrl:
      "燕麦.jpg",
    
  },
  {
    id: "jidanmian",
    category: "carb",
    title: "西红柿鸡蛋面",
    desc: "适合早上吃，但您随意想啥时候吃啥时候吃，半夜下单都可以",
    price: Infinity,
    imageUrl:
      "西红柿鸡蛋面.jpg",
    
  },
  {
    id: "qiangguomian",
    category: "carb",
    title: "白菜炝锅面",
    desc: "同⬆️",
    price: Infinity,
    imageUrl:
      "白菜抢过面.jpg",
    
  },
  {
    id: "mifan",
    category: "carb",
    title: "米饭",
    desc: "纯碳水，香，建议搭配糖续排骨可乐鸡翅",
    price: Infinity,
    imageUrl:
      "米饭.jpg",
    
  },
  {
    id: "qingcaichaoniurou",
    category: "healthy",
    title: "青菜炒牛肉",
    desc: "蒜蓉炒，还行 介于好吃和能吃之间",
    price: Infinity,
    imageUrl:
      "青菜炒牛肉.jpg",
  },
  {
    id: "suanrongqingcai",
    category: "healthy",
    title: "蒜蓉青菜",
    desc: "健康",
    price: Infinity,
    imageUrl:
      "蒜蓉小白菜.jpg",

  },
  {
    id: "sanwenyu",
    category: "healthy",
    title: "香煎三文鱼",
    desc: "介于好吃和能吃之间",
    price: Infinity,
    imageUrl:
      "香煎三文鱼.jpg",
    badge: "能吃",
    
  },
  {
    id: "zhaoshaojituirou",
    category: "healthy",
    title: "照烧鸡腿肉",
    desc: "有点下饭请慎重",
    price: Infinity,
    imageUrl:
      "照烧鸡腿肉.jpg",

  },
  {
    id: "baicainiurou",
    category: "healthy",
    title: "清水白菜牛肉",
    desc: "没做过可以试试",
    price: Infinity,
    imageUrl:
      "清水白菜牛肉.jpg",

  },
  {
    id: "haokandewan",
    category: "healthy",
    title: "好看的碗",
    desc: "牛肉，鸡蛋，蔬菜，牛油果",
    price: Infinity,
    imageUrl:
      "好看的碗.jpg",
    badge: "感觉吃不饱",
  },
  {
    id: "kiss2",
    category: "healthy",
    title: "亲亲",
    desc: "送给厨师，建议多点（也别点太多我怕出bug）",
    price: Infinity,
    imageUrl:
      "kiss.png",
    badge: "Chef's favorite",
  },
   {
    id: "tangxindan",
    category: "healthy",
    title: "溏心蛋",
    desc: "ezez",
    price: Infinity,
    imageUrl:
      "溏心蛋.jpg",

  },
  {
    id: "molinaibai",
    category: "drink",
    title: "茉莉奶白",
    desc: "不会做，可以代点",
    price: Infinity,
    imageUrl:
      "茉莉奶白.jpg",
   
  },
  {
    id: "kaixinguo",
    category: "drink",
    title: "开心果茉莉椰",
    desc: "不会做，可以代点",
    price: Infinity,
    imageUrl:
      "开心果茉莉椰.jpg",

  },
  {
    id: "ningmengcha",
    category: "drink",
    title: "柠檬茶",
    desc: "不会做，可以代点",
    price: Infinity,
    imageUrl:
      "柠檬茶.jpg",
  },
  {
    id: "shuiguolao",
    category: "desert",
    title: "水果捞",
    desc: "不会做可以代点 代吃",
    price: Infinity,
    imageUrl:
      "水果捞.jpg",
   
  },
  {
    id: "mangguosanmingzhi",
    category: "desert",
    title: "芒果三明治",
    desc: "会做，好吃",
    price: Infinity,
    imageUrl:
      "芒果三明治.jpg",
   
  },
 
  {
    id: "jifanjiang",
    category: "entre",
    title: "鸡蛋酱",
    desc: "the Queen said:香香浓浓配蔬菜",
    price: Infinity,
    imageUrl:
      "鸡蛋酱.jpg",

  },
  {
    id: "niuroubanmian",
    category: "entre",
    title: "牛肉丝拌面",
    desc: "牛肉板面来咯，实物可能与图片不符",
    price: Infinity,
    imageUrl:
      "牛肉板面.jpg",

  },
    {
    id: "kiss",
    category: "entre",
    title: "亲亲",
    desc: "送给厨师，建议多点（也别点太多我怕出bug）",
    price: Infinity,
    imageUrl:
      "kiss.png",
    badge: "Chef's favorite",
  },


  

];
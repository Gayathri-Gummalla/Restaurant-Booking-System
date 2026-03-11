export type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isVeg: boolean;
    spiceLevel: 0 | 1 | 2 | 3;
};

export type MenuCategory = {
    id: string;
    name: string;
    description: string;
    bannerImage: string;
    items: MenuItem[];
};

export const menuData: Record<string, MenuCategory> = {
    "andhra-traditional-meals": {
        id: "andhra-traditional-meals",
        name: "Andhra Traditional Meals",
        description: "Experience the authentic flavors of Andhra served on a traditional banana leaf, where every spice tells a story of royalty and tradition.",
        bannerImage: "/images/andhra-meals.png",
        items: [
            {
                id: "andhra-royal-bhojanam",
                name: "Andhra Royal Bhojanam",
                description: "The ultimate royal feast served on a lush banana leaf. Includes signature Mudda Pappu, Avakaya, Pulusu, 3 types of Veppudu (fry), Sambar, Rasam, and Purnam Burelu.",
                price: 499,
                image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1200&q=80",
                isVeg: true,
                spiceLevel: 2
            },
            {
                id: "andhra-veg-thali",
                name: "Andhra Veg Thali",
                description: "A traditional steel thali experience with a variety of seasonal vegetables, dals, and house-made specialties served with steamed rice and ghee.",
                price: 350,
                image: "https://images.unsplash.com/photo-1604908176997-43136b47c4d1?auto=format&fit=crop&w=1200&q=80",
                isVeg: true,
                spiceLevel: 2
            },
            {
                id: "gutti-vankaya-kura",
                name: "Gutti Vankaya Kura",
                description: "Succulent stuffed baby eggplants slow-cooked in a rich peanut, sesame, and spice gravy. A masterpiece of Andhra vegetarian cooking.",
                price: 320,
                image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80",
                isVeg: true,
                spiceLevel: 2
            },
            {
                id: "avakaya-rice",
                name: "Avakaya Rice",
                description: "Fragrant steamed rice mixed with the legendary Guntur mango pickle (Avakaya) and premium ghee. Simple, spicy, and soul-satisfying.",
                price: 240,
                image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
                isVeg: true,
                spiceLevel: 3
            },
            {
                id: "majjiga-pulusu",
                name: "Majjiga Pulusu",
                description: "Traditional tempered buttermilk stew with ash gourd and ginger. A cooling companion to the fiery Andhra spices.",
                price: 180,
                image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80",
                isVeg: true,
                spiceLevel: 1
            },
            {
                id: "curd-rice",
                name: "Curd Rice",
                description: "Velvety smooth rice mixed with fresh yogurt and tempered with mustard, curry leaves, and a hint of ginger for the perfect finish.",
                price: 150,
                image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80",
                isVeg: true,
                spiceLevel: 0
            }
        ]
    },
    "south-indian-delicacies": {
        id: "south-indian-delicacies",
        name: "South Indian Delicacies",
        description: "Timeless favorites from across South India, perfected with house-made batters and pure ghee.",
        bannerImage: "/images/hero-bg-royal-hd.png",
        items: [
            {
                id: "masala-dosa",
                name: "Masala Dosa",
                description: "Crispy golden dosa stuffed with spiced potato masala, served with 3 types of chutneys and hot sambar.",
                price: 180,
                image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 1
            },
            {
                id: "ghee-roast-dosa",
                name: "Ghee Roast Dosa",
                description: "Extra crispy dosa roasted in pure, aromatic ghee for a melt-in-your-mouth experience.",
                price: 210,
                image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 0
            },
            {
                id: "pesarattu",
                name: "Pesarattu",
                description: "Andhra-style green gram dosa, high in nutrition and full of earthy flavor. Best enjoyed with ginger chutney.",
                price: 160,
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 1
            },
            {
                id: "medu-vada",
                name: "Medu Vada",
                description: "Crispy fried urad dal fritters, fluffy inside and golden outside. Served with chutney & sambar.",
                price: 120,
                image: "https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 1
            },
            {
                id: "pongal",
                name: "Pongal",
                description: "Creamy comfort rice and moong dal tempered with ghee, black pepper, ginger, and curry leaves.",
                price: 150,
                image: "https://images.unsplash.com/photo-1589301773838-892404f29119?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 0
            },
            {
                id: "mini-tiffin-combo",
                name: "Mini Tiffin Combo",
                description: "The best of everything: 1 Idli, 1 Vada, and a small Masala Dosa served with all accompaniments.",
                price: 280,
                image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 1
            }
        ]
    },
    "tandoori-grilled-specials": {
        id: "tandoori-grilled-specials",
        name: "Tandoori & Grilled Specials",
        description: "Smoky, charred, and tender delicacies from our clay oven.",
        bannerImage: "/images/hero-bg.png",
        items: [
            {
                id: "tandoori-chicken",
                name: "Tandoori Chicken",
                description: "The classic king of tandoor. Whole chicken marinated in yogurt and spices, roasted in the clay oven.",
                price: 420,
                image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 2
            },
            {
                id: "chicken-tikka",
                name: "Chicken Tikka",
                description: "Boneless chicken cubes marinated in a spicy yogurt mix and grilled to smoky perfection.",
                price: 380,
                image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 2
            },
            {
                id: "paneer-tikka",
                name: "Paneer Tikka",
                description: "Chunks of fresh cottage cheese, peppers, and onions marinated in tandoori masala and skewed.",
                price: 340,
                image: "https://images.unsplash.com/photo-1567184109191-3783bcca3583?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 2
            },
            {
                id: "tangdi-kebab",
                name: "Tangdi Kebab",
                description: "Juicy chicken drumsticks marinated in a royal blend of spices and grilled in the tandoor.",
                price: 450,
                image: "https://images.unsplash.com/photo-1626776878893-680c65793077?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 2
            },
            {
                id: "mutton-seekh-kebab",
                name: "Mutton Seekh Kebab",
                description: "Spiced minced mutton flavored with mint and coriander, grilled on skewers in the clay oven.",
                price: 490,
                image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 3
            },
            {
                id: "mixed-grill-platter",
                name: "Mixed Grill Platter",
                description: "A decadent assortment of Chicken Tikka, Seekh Kebab, and Tandoori Prawns served sizzling.",
                price: 850,
                image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 2
            }
        ]
    },
    "mughlai-classics": {
        id: "mughlai-classics",
        name: "Mughlai Classics",
        description: "Rich, aromatic, and decadent gravies from the royal kitchens.",
        bannerImage: "/images/andhra-veg-thali.jpg",
        items: [
            {
                id: "butter-chicken",
                name: "Butter Chicken",
                description: "Succulent charcoal-grilled chicken in a silky, creamy tomato-based rich buttery gravy.",
                price: 420,
                image: "https://images.unsplash.com/photo-1603894584714-f4b2b604a05a?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 1
            },
            {
                id: "mutton-rogan-josh",
                name: "Mutton Rogan Josh",
                description: "Heritage Kashmiri recipe with tender slow-cooked mutton in a fragrant thin red gravy.",
                price: 550,
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 2
            },
            {
                id: "chicken-korma",
                name: "Chicken Korma",
                description: "A royal mild gravy made with nuts, yogurt, cream, and delicate whole spices.",
                price: 440,
                image: "https://images.unsplash.com/photo-1603894584714-f4b2b604a05a?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 1
            },
            {
                id: "shahi-paneer",
                name: "Shahi Paneer",
                description: "Cottage cheese cubes simmered in a rich, velvety cashew and onion gravy with hints of saffron.",
                price: 360,
                image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 1
            },
            {
                id: "dal-makhani",
                name: "Dal Makhani",
                description: "Whole black lentils slow-cooked overnight with spices, dollops of butter, and fresh cream.",
                price: 320,
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 0
            },
            {
                id: "chicken-changezi",
                name: "Chicken Changezi",
                description: "Spicy and tangy Mughlai-style chicken gravy with a distinctive semi-dry texture.",
                price: 460,
                image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 3
            }
        ]
    },
    "indo-chinese-fusion": {
        id: "indo-chinese-fusion",
        name: "Indo-Chinese Fusion",
        description: "The perfect blend of bold Chinese techniques and fiery Indian flavors.",
        bannerImage: "/images/hero.png",
        items: [
            {
                id: "chilli-chicken",
                name: "Chilli Chicken",
                description: "The most popular Indo-Chinese dish. Spicy battered chicken tossed with peppers and soy sauce.",
                price: 320,
                image: "/images/chilli-chicken.png",
                isVeg: false,
                spiceLevel: 2
            },
            {
                id: "gobi-manchurian",
                name: "Gobi Manchurian",
                description: "Deep-fried crispy cauliflower florets tossed in a tangy ginger, garlic, and celery sauce.",
                price: 240,
                image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 2
            },
            {
                id: "chicken-hakka-noodles",
                name: "Chicken Hakka Noodles",
                description: "Wok-fried noodles with crisp vegetables and tender julienned chicken.",
                price: 280,
                image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 1
            },
            {
                id: "veg-fried-rice",
                name: "Veg Fried Rice",
                description: "Classic aromatic long-grain rice wok-tossed with finely chopped fresh vegetables.",
                price: 220,
                image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 1
            },
            {
                id: "dragon-chicken",
                name: "Dragon Chicken",
                description: "Spicy thin chicken strips fried and tossed in a fiery red sauce with cashew nuts.",
                price: 350,
                image: "https://images.unsplash.com/photo-1562607311-2834248a846c?auto=format&fit=crop&q=80&w=1200",
                isVeg: false,
                spiceLevel: 3
            },
            {
                id: "paneer-manchurian",
                name: "Paneer Manchurian",
                description: "Soft cottage cheese chunks prepared in a classic Indo-Chinese tangy sauce.",
                price: 290,
                image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 2
            }
        ]
    },
    "desserts-beverages": {
        id: "desserts-beverages",
        name: "Desserts & Beverages",
        description: "A sweet conclusion and refreshing sips to complement your meal.",
        bannerImage: "/images/desserts-banner.png",
        items: [
            {
                id: "gulab-jamun",
                name: "Gulab Jamun",
                description: "Two soft milk-solid dumplings seeped in rose-scented cardamom sugar syrup.",
                price: 120,
                image: "/images/gulab-jamun.png",
                isVeg: true,
                spiceLevel: 0
            },
            {
                id: "double-ka-meetha",
                name: "Double Ka Meetha",
                description: "The Nizami special: fried bread pudding soaked in saffron milk and dry fruits.",
                price: 180,
                image: "/images/double-ka-meetha.png",
                isVeg: true,
                spiceLevel: 0
            },
            {
                id: "rasmalai",
                name: "Rasmalai",
                description: "Two soft and spongy cottage cheese discs floating in a thick, chilled malai milk sauce.",
                price: 160,
                image: "/images/rasmalai.png",
                isVeg: true,
                spiceLevel: 0
            },
            {
                id: "chocolate-brownie",
                name: "Chocolate Brownie with Ice Cream",
                description: "Warm, fudgy chocolate brownie served with a scoop of premium vanilla bean ice cream.",
                price: 240,
                image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=1200",
                isVeg: true,
                spiceLevel: 0
            },
            {
                id: "mango-lassi",
                name: "Mango Lassi",
                description: "Refreshing and thick yogurt drink blended with fresh Alphonso mango pulp.",
                price: 140,
                image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1200&q=80",
                isVeg: true,
                spiceLevel: 0
            },
            {
                id: "filter-coffee",
                name: "Filter Coffee",
                description: "The authentic South Indian strong coffee, decocted using premium beans and served frothy.",
                price: 90,
                image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80",
                isVeg: true,
                spiceLevel: 0
            }
        ]
    }
};

import connectToDatabase from "@/lib/db";
import Wish from "@/lib/models/Wish";

export interface IWishItem {
  _id: string;
  name: string;
  attendance: string;
  guests: number;
  message: string;
  createdAt: string;
}

// In-memory store fallback for demo & preview when MongoDB is unconfigured
const inMemoryWishes: IWishItem[] = [
  {
    _id: "mem-1",
    name: "Jonathan & Sarah",
    attendance: "Hadir",
    guests: 2,
    message: "Wishing you both a lifetime of love and happiness! Congratulations on your special day!",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    _id: "mem-2",
    name: "Michael Chen",
    attendance: "Hadir",
    guests: 1,
    message: "Warmest congratulations to the lovely couple! So excited to celebrate with you.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: "mem-3",
    name: "Amanda Wijaya",
    attendance: "Tidak Hadir",
    guests: 1,
    message: "Sending my heartfelt congratulations from afar! May your marriage be abundantly blessed.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export async function getWishes(page: number = 1, limit: number = 5) {
  const isDbReady = await connectToDatabase();
  if (isDbReady) {
    try {
      const wishes = await Wish.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const totalWishes = await Wish.countDocuments();
      return {
        wishes,
        totalPages: Math.max(1, Math.ceil(totalWishes / limit)),
        currentPage: page,
      };
    } catch (err) {
      console.warn("[AI Studio] MongoDB query error, falling back to in-memory store:", err);
    }
  }

  // Fallback to in-memory store
  const totalWishes = inMemoryWishes.length;
  const start = (page - 1) * limit;
  const paginated = inMemoryWishes.slice(start, start + limit);

  return {
    wishes: paginated,
    totalPages: Math.max(1, Math.ceil(totalWishes / limit)),
    currentPage: page,
  };
}

export async function addWish(wishData: {
  name: string;
  attendance: string;
  guests: number;
  message: string;
}) {
  const isDbReady = await connectToDatabase();
  if (isDbReady) {
    try {
      const created = await Wish.create(wishData);
      return created;
    } catch (err) {
      console.warn("[AI Studio] MongoDB create error, falling back to in-memory store:", err);
    }
  }

  // Fallback to in-memory store
  const newWish: IWishItem = {
    _id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    ...wishData,
    createdAt: new Date().toISOString(),
  };
  inMemoryWishes.unshift(newWish);
  return newWish;
}

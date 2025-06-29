"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "./auth";

export async function getUserBySession() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  return user;
}

// Enhanced status calculation to match dashboard logic
function getUrlStatus(expiresAt) {
  if (!expiresAt) return "active";
  
  const now = new Date();
  const expiration = new Date(expiresAt);
  const diffMs = expiration.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffMs <= 0) {
    return "expired";
  } else if (diffHours <= 6) {
    return "expiring-very-soon"; // Less than 6 hours
  } else if (diffDays <= 1) {
    return "expiring-soon"; // Less than 1 day
  } else if (diffDays <= 2) {
    return "expiring-moderate"; // Less than 2 days
  } else {
    return "active";
  }
}

// Enhanced time remaining calculation to match dashboard
function getTimeRemaining(expiresAt) {
  if (!expiresAt) return null;
  
  const now = new Date();
  const expiration = new Date(expiresAt);
  const diffMs = expiration.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return "Expired";
  }
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} left`;
  } else {
    return "Expires in moments";
  }
}

// Get status counts for dashboard stats
function getUrlStatusCounts(urls) {
  const counts = {
    active: 0,
    expiring: 0,
    expired: 0
  };

  urls.forEach(url => {
    const status = getUrlStatus(url.expiresAt);
    if (status === 'expired') {
      counts.expired++;
    } else if (['expiring-very-soon', 'expiring-soon', 'expiring-moderate'].includes(status)) {
      counts.expiring++;
    } else {
      counts.active++;
    }
  });

  return counts;
}

export async function getUserUrlStats() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    // Get user with all their URLs and detailed stats
    const userWithUrls = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        urls: {
          select: {
            id: true,
            originalUrl: true,
            shortCode: true,
            clicks: true,
            createdAt: true,
            expiresAt: true,
          },
          orderBy: {
            createdAt: 'desc' // Most recent first
          }
        }
      }
    });

    if (!userWithUrls) {
      throw new Error("User not found");
    }

    // Enhanced URL processing with detailed status information
    const now = new Date();
    const enhancedUrls = userWithUrls.urls.map(url => {
      const status = getUrlStatus(url.expiresAt);
      const timeRemaining = getTimeRemaining(url.expiresAt);
      const isExpired = url.expiresAt && url.expiresAt <= now;
      const daysUntilExpiry = url.expiresAt 
        ? Math.ceil((url.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      
      return {
        ...url,
        status,
        timeRemaining,
        isExpired,
        daysUntilExpiry,
        clicksToday: 0, // You can implement this based on your click tracking
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${url.shortCode}`,
        daysSinceCreated: Math.floor((now.getTime() - url.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      };
    });

    // Get status counts for dashboard
    const statusCounts = getUrlStatusCounts(userWithUrls.urls);

    // Calculate enhanced statistics
    const stats = {
      totalLinks: userWithUrls.urls.length,
      totalClicks: userWithUrls.urls.reduce((sum, url) => sum + url.clicks, 0),
      activeLinks: statusCounts.active,
      expiringLinks: statusCounts.expiring,
      expiredLinks: statusCounts.expired,
      averageClicksPerLink: userWithUrls.urls.length > 0 
        ? Math.round((userWithUrls.urls.reduce((sum, url) => sum + url.clicks, 0) / userWithUrls.urls.length) * 100) / 100
        : 0,
      mostClickedLink: userWithUrls.urls.length > 0 
        ? userWithUrls.urls.reduce((max, url) => url.clicks > max.clicks ? url : max)
        : null,
      recentLinks: enhancedUrls.slice(0, 5), // Last 5 links with enhanced data
      linksExpiringSoon: enhancedUrls.filter(url => 
        ['expiring-very-soon', 'expiring-soon', 'expiring-moderate'].includes(url.status)
      ),
      statusCounts // Add this for easy access in dashboard
    };

    return {
      user: {
        id: userWithUrls.id,
        name: userWithUrls.name,
        email: userWithUrls.email,
        createdAt: userWithUrls.createdAt
      },
      urls: enhancedUrls, // Return enhanced URLs with all status info
      stats
    };

  } catch (error) {
    console.error("Error fetching user URL stats:", error);
    throw new Error("Failed to fetch user statistics");
  }
}

export async function getUserUrlsWithDetails() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        urls: {
          select: {
            id: true,
            originalUrl: true,
            shortCode: true,
            clicks: true,
            createdAt: true,
            expiresAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Enhanced URL processing to match dashboard expectations
    const urlsWithDetails = user.urls.map(url => {
      const now = new Date();
      const status = getUrlStatus(url.expiresAt);
      const timeRemaining = getTimeRemaining(url.expiresAt);
      const isExpired = url.expiresAt && url.expiresAt <= now;
      const daysUntilExpiry = url.expiresAt 
        ? Math.ceil((url.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      
      return {
        ...url,
        status, // Enhanced status matching dashboard logic
        timeRemaining, // Formatted time remaining string
        isExpired,
        daysUntilExpiry,
        clicksToday: 0,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${url.shortCode}`,
        daysSinceCreated: Math.floor((now.getTime() - url.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      };
    });

    return urlsWithDetails;

  } catch (error) {
    console.error("Error fetching user URLs:", error);
    throw new Error("Failed to fetch user URLs");
  }
}

// Additional helper function for getting just status counts
export async function getUserUrlStatusCounts() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        urls: {
          select: {
            expiresAt: true,
          }
        }
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return getUrlStatusCounts(user.urls);

  } catch (error) {
    console.error("Error fetching URL status counts:", error);
    throw new Error("Failed to fetch URL status counts");
  }
}
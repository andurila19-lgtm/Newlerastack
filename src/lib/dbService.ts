// src/lib/dbService.ts
import { prisma } from './db';
import { mockTemplates, TemplateItem } from './mockData';
import { hashPassword } from './auth';

// In-memory data store for fallback when database is disconnected or not configured
class InMemoryStore {
  templates: any[] = [];
  users: any[] = [];
  purchases: any[] = [];
  bookmarks: any[] = [];
  licenses: any[] = [];
  analyticsDaily: any[] = [];

  constructor() {
    this.templates = [...mockTemplates];
    // Seed default admin and user
    this.users = [
      {
        id: "usr-admin",
        email: "admin@newlera.com",
        name: "Admin Newlera",
        passwordHash: hashPassword("admin123"),
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "usr-demo",
        email: "demo@newlera.com",
        name: "Demo Customer",
        passwordHash: hashPassword("demo123"),
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Seed default purchases for demo
    this.purchases = [
      {
        id: "pur-1",
        userId: "usr-demo",
        templateId: "tpl-1",
        amount: 49.0,
        status: "COMPLETED",
        licenseKey: "NWL-NWLA-8392-DK21",
        purchaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    this.licenses = [
      {
        id: "lic-1",
        licenseKey: "NWL-NWLA-8392-DK21",
        purchaseId: "pur-1",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    this.bookmarks = [
      {
        id: "bm-1",
        userId: "usr-demo",
        templateId: "tpl-2",
        createdAt: new Date()
      }
    ];
  }
}

const memoryStore = new InMemoryStore();
let dbCheckFailed = false;

// Simple helper to log database state
function logDbState(error: any) {
  if (!dbCheckFailed) {
    console.warn("⚠️ PostgreSQL database check failed, falling back to In-Memory store for demonstration.");
    console.error(error.message);
    dbCheckFailed = true;
  }
}

export const dbService = {
  // --- TEMPLATES ---
  async getTemplates(): Promise<any[]> {
    try {
      return await prisma.template.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      logDbState(e);
      return memoryStore.templates;
    }
  },

  async getTemplateBySlug(slug: string): Promise<any | null> {
    try {
      return await prisma.template.findUnique({
        where: { slug }
      });
    } catch (e) {
      logDbState(e);
      return memoryStore.templates.find(t => t.slug === slug) || null;
    }
  },

  async getTemplateById(id: string): Promise<any | null> {
    try {
      return await prisma.template.findUnique({
        where: { id }
      });
    } catch (e) {
      logDbState(e);
      return memoryStore.templates.find(t => t.id === id) || null;
    }
  },

  async createTemplate(data: Omit<TemplateItem, 'id' | 'salesCount' | 'rating'>): Promise<any> {
    try {
      return await prisma.template.create({
        data: {
          ...data,
          salesCount: 0,
          screenshots: JSON.stringify(data.screenshots),
          features: JSON.stringify(data.features),
          techStack: JSON.stringify(data.techStack),
          changelog: JSON.stringify(data.changelog)
        }
      });
    } catch (e) {
      logDbState(e);
      const newTemplate = {
        id: `tpl-${Date.now()}`,
        salesCount: 0,
        rating: 5.0,
        ...data
      };
      memoryStore.templates.unshift(newTemplate);
      return newTemplate;
    }
  },

  async updateTemplate(id: string, data: Partial<TemplateItem>): Promise<any> {
    try {
      // Handle serialized JSON arrays for Prisma if database supports it
      const updateData: any = { ...data };
      if (data.screenshots) updateData.screenshots = JSON.stringify(data.screenshots);
      if (data.features) updateData.features = JSON.stringify(data.features);
      if (data.techStack) updateData.techStack = JSON.stringify(data.techStack);
      if (data.changelog) updateData.changelog = JSON.stringify(data.changelog);

      return await prisma.template.update({
        where: { id },
        data: updateData
      });
    } catch (e) {
      logDbState(e);
      const index = memoryStore.templates.findIndex(t => t.id === id);
      if (index !== -1) {
        memoryStore.templates[index] = { ...memoryStore.templates[index], ...data };
        return memoryStore.templates[index];
      }
      throw new Error("Template not found");
    }
  },

  async deleteTemplate(id: string): Promise<boolean> {
    try {
      await prisma.template.delete({
        where: { id }
      });
      return true;
    } catch (e) {
      logDbState(e);
      const initialLength = memoryStore.templates.length;
      memoryStore.templates = memoryStore.templates.filter(t => t.id !== id);
      return memoryStore.templates.length < initialLength;
    }
  },

  // --- USERS ---
  async getUserByEmail(email: string): Promise<any | null> {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (e) {
      logDbState(e);
      return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  },

  async createUser(email: string, passwordHash: string, name: string): Promise<any> {
    try {
      return await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: "USER"
        }
      });
    } catch (e) {
      logDbState(e);
      const newUser = {
        id: `usr-${Date.now()}`,
        email,
        passwordHash,
        name,
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.users.push(newUser);
      return newUser;
    }
  },

  async getAllUsers(): Promise<any[]> {
    try {
      return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      logDbState(e);
      return memoryStore.users;
    }
  },

  async updateUserRole(id: string, role: string): Promise<any> {
    try {
      return await prisma.user.update({
        where: { id },
        data: { role }
      });
    } catch (e) {
      logDbState(e);
      const user = memoryStore.users.find(u => u.id === id);
      if (user) {
        user.role = role;
        return user;
      }
      throw new Error("User not found");
    }
  },

  // --- PURCHASES & DOWNLOADS ---
  async getPurchasesByUser(userId: string): Promise<any[]> {
    try {
      return await prisma.purchase.findMany({
        where: { userId },
        include: { template: true },
        orderBy: { purchaseDate: 'desc' }
      });
    } catch (e) {
      logDbState(e);
      const userPurchases = memoryStore.purchases.filter(p => p.userId === userId);
      return userPurchases.map(p => ({
        ...p,
        template: memoryStore.templates.find(t => t.id === p.templateId)
      }));
    }
  },

  async getAllPurchases(): Promise<any[]> {
    try {
      return await prisma.purchase.findMany({
        include: { template: true, user: true },
        orderBy: { purchaseDate: 'desc' }
      });
    } catch (e) {
      logDbState(e);
      return memoryStore.purchases.map(p => ({
        ...p,
        template: memoryStore.templates.find(t => t.id === p.templateId),
        user: memoryStore.users.find(u => u.id === p.userId)
      }));
    }
  },

  async checkUserPurchase(userId: string, templateId: string): Promise<boolean> {
    try {
      const purchase = await prisma.purchase.findFirst({
        where: { userId, templateId, status: "COMPLETED" }
      });
      return !!purchase;
    } catch (e) {
      logDbState(e);
      return memoryStore.purchases.some(p => p.userId === userId && p.templateId === templateId && p.status === "COMPLETED");
    }
  },

  async createPurchase(userId: string, templateId: string, amount: number): Promise<any> {
    const licenseKey = `NWL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    try {
      const purchase = await prisma.purchase.create({
        data: {
          userId,
          templateId,
          amount,
          licenseKey,
          status: "COMPLETED"
        }
      });
      
      // Update template sales count
      await prisma.template.update({
        where: { id: templateId },
        data: { salesCount: { increment: 1 } }
      });

      // Create license key
      await prisma.license.create({
        data: {
          licenseKey,
          purchaseId: purchase.id,
          status: "ACTIVE"
        }
      });

      return purchase;
    } catch (e) {
      logDbState(e);
      const purchaseId = `pur-${Date.now()}`;
      const newPurchase = {
        id: purchaseId,
        userId,
        templateId,
        amount,
        status: "COMPLETED",
        licenseKey,
        purchaseDate: new Date()
      };
      
      memoryStore.purchases.push(newPurchase);

      // Increment memory sales count
      const template = memoryStore.templates.find(t => t.id === templateId);
      if (template) template.salesCount += 1;

      // Add to licenses
      memoryStore.licenses.push({
        id: `lic-${Date.now()}`,
        licenseKey,
        purchaseId,
        status: "ACTIVE",
        createdAt: new Date()
      });

      return newPurchase;
    }
  },

  // --- LICENSES ---
  async getAllLicenses(): Promise<any[]> {
    try {
      return await prisma.license.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      logDbState(e);
      return memoryStore.licenses;
    }
  },

  async updateLicenseStatus(licenseKey: string, status: string): Promise<any> {
    try {
      return await prisma.license.update({
        where: { licenseKey },
        data: { status }
      });
    } catch (e) {
      logDbState(e);
      const license = memoryStore.licenses.find(l => l.licenseKey === licenseKey);
      if (license) {
        license.status = status;
        return license;
      }
      throw new Error("License key not found");
    }
  },

  // --- BOOKMARKS ---
  async getBookmarksByUser(userId: string): Promise<any[]> {
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId },
        include: { template: true },
        orderBy: { createdAt: 'desc' }
      });
      return bookmarks.map(b => b.template);
    } catch (e) {
      logDbState(e);
      const userBookmarks = memoryStore.bookmarks.filter((b: any) => b.userId === userId);
      return userBookmarks.map((b: any) => memoryStore.templates.find(t => t.id === b.templateId)).filter(Boolean);
    }
  },

  async toggleBookmark(userId: string, templateId: string): Promise<{ bookmarked: boolean }> {
    try {
      const existing = await prisma.bookmark.findUnique({
        where: {
          userId_templateId: { userId, templateId }
        }
      });

      if (existing) {
        await prisma.bookmark.delete({
          where: { id: existing.id }
        });
        return { bookmarked: false };
      } else {
        await prisma.bookmark.create({
          data: { userId, templateId }
        });
        return { bookmarked: true };
      }
    } catch (e) {
      logDbState(e);
      const index = memoryStore.bookmarks.findIndex(b => b.userId === userId && b.templateId === templateId);
      if (index !== -1) {
        memoryStore.bookmarks.splice(index, 1);
        return { bookmarked: false };
      } else {
        memoryStore.bookmarks.push({
          id: `bm-${Date.now()}`,
          userId,
          templateId,
          createdAt: new Date()
        });
        return { bookmarked: true };
      }
    }
  },

  // --- ANALYTICS ---
  async getAnalyticsData(): Promise<{
    revenue: number;
    salesCount: number;
    downloads: number;
    visitors: number;
    revenueHistory: { name: string; revenue: number; sales: number }[];
    recentPurchases: any[];
  }> {
    // Generate analytics based on purchases
    let totalRevenue = 0;
    let totalSales = 0;
    let purchasesList: any[] = [];

    try {
      purchasesList = await this.getAllPurchases();
    } catch (e) {
      purchasesList = memoryStore.purchases.map(p => ({
        ...p,
        template: memoryStore.templates.find(t => t.id === p.templateId),
        user: memoryStore.users.find(u => u.id === p.userId)
      }));
    }

    purchasesList.forEach(p => {
      totalRevenue += p.amount;
      totalSales += 1;
    });

    const mockHistory = [
      { name: 'Jan', revenue: totalRevenue * 0.15, sales: Math.ceil(totalSales * 0.15) },
      { name: 'Feb', revenue: totalRevenue * 0.25, sales: Math.ceil(totalSales * 0.25) },
      { name: 'Mar', revenue: totalRevenue * 0.40, sales: Math.ceil(totalSales * 0.40) },
      { name: 'Apr', revenue: totalRevenue * 0.65, sales: Math.ceil(totalSales * 0.65) },
      { name: 'May', revenue: totalRevenue, sales: totalSales }
    ];

    return {
      revenue: totalRevenue || 3450.0, // Fallback default
      salesCount: totalSales || 42,
      downloads: (totalSales * 3) || 128,
      visitors: 1240,
      revenueHistory: mockHistory,
      recentPurchases: purchasesList.slice(0, 5)
    };
  }
};

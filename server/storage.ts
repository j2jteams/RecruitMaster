import {
  users,
  positions,
  candidates,
  type User,
  type UpsertUser,
  type Position,
  type InsertPosition,
  type Candidate,
  type InsertCandidate,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Position operations
  getPositions(): Promise<Position[]>;
  createPosition(position: InsertPosition): Promise<Position>;
  updatePosition(id: number, position: Partial<InsertPosition>): Promise<Position>;
  deletePosition(id: number): Promise<void>;
  
  // Candidate operations
  getCandidates(filters?: {
    position?: string;
    status?: string;
    search?: string;
  }): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: number, candidate: Partial<InsertCandidate>): Promise<Candidate>;
  deleteCandidate(id: number): Promise<void>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalPositions: number;
    totalCandidates: number;
    inReview: number;
    shortlisted: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Position operations
  async getPositions(): Promise<Position[]> {
    return await db.select().from(positions).orderBy(desc(positions.createdAt));
  }

  async createPosition(position: InsertPosition): Promise<Position> {
    const [newPosition] = await db
      .insert(positions)
      .values(position)
      .returning();
    return newPosition;
  }

  async updatePosition(id: number, position: Partial<InsertPosition>): Promise<Position> {
    const [updatedPosition] = await db
      .update(positions)
      .set({ ...position, updatedAt: new Date() })
      .where(eq(positions.id, id))
      .returning();
    return updatedPosition;
  }

  async deletePosition(id: number): Promise<void> {
    await db.delete(positions).where(eq(positions.id, id));
  }

  // Candidate operations
  async getCandidates(filters?: {
    position?: string;
    status?: string;
    search?: string;
  }): Promise<Candidate[]> {
    const conditions = [];
    
    if (filters?.position) {
      conditions.push(eq(candidates.positionApplied, filters.position));
    }
    
    if (filters?.status) {
      conditions.push(eq(candidates.status, filters.status));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          ilike(candidates.name, `%${filters.search}%`),
          ilike(candidates.email, `%${filters.search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      return await db.select().from(candidates).where(and(...conditions)).orderBy(desc(candidates.createdAt));
    } else {
      return await db.select().from(candidates).orderBy(desc(candidates.createdAt));
    }
  }

  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const [newCandidate] = await db
      .insert(candidates)
      .values(candidate)
      .returning();
    return newCandidate;
  }

  async updateCandidate(id: number, candidate: Partial<InsertCandidate>): Promise<Candidate> {
    const [updatedCandidate] = await db
      .update(candidates)
      .set({ ...candidate, updatedAt: new Date() })
      .where(eq(candidates.id, id))
      .returning();
    return updatedCandidate;
  }

  async deleteCandidate(id: number): Promise<void> {
    await db.delete(candidates).where(eq(candidates.id, id));
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalPositions: number;
    totalCandidates: number;
    inReview: number;
    shortlisted: number;
  }> {
    const [positionsCount] = await db
      .select({ count: count() })
      .from(positions);
    
    const [candidatesCount] = await db
      .select({ count: count() })
      .from(candidates);
    
    const [inReviewCount] = await db
      .select({ count: count() })
      .from(candidates)
      .where(eq(candidates.status, "In Review"));
    
    const [shortlistedCount] = await db
      .select({ count: count() })
      .from(candidates)
      .where(eq(candidates.status, "Shortlisted"));
    
    return {
      totalPositions: positionsCount?.count || 0,
      totalCandidates: candidatesCount?.count || 0,
      inReview: inReviewCount?.count || 0,
      shortlisted: shortlistedCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();

import {
  type User,
  type UpsertUser,
  type Position,
  type InsertPosition,
  type Candidate,
  type InsertCandidate,
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private positions: Map<number, Position> = new Map();
  private candidates: Map<number, Candidate> = new Map();
  private nextPositionId = 1;
  private nextCandidateId = 1;

  constructor() {
    // Add some sample data
    this.positions.set(1, {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      description: "We're looking for a Senior Frontend Developer to join our engineering team.",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.nextPositionId = 2;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Position operations
  async getPositions(): Promise<Position[]> {
    return Array.from(this.positions.values()).sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateB - dateA;
    });
  }

  async createPosition(position: InsertPosition): Promise<Position> {
    const newPosition: Position = {
      id: this.nextPositionId++,
      title: position.title,
      department: position.department,
      location: position.location,
      description: position.description || null,
      status: position.status || "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.positions.set(newPosition.id, newPosition);
    return newPosition;
  }

  async updatePosition(id: number, position: Partial<InsertPosition>): Promise<Position> {
    const existingPosition = this.positions.get(id);
    if (!existingPosition) {
      throw new Error(`Position with id ${id} not found`);
    }
    
    const updatedPosition: Position = {
      ...existingPosition,
      ...position,
      updatedAt: new Date(),
    };
    this.positions.set(id, updatedPosition);
    return updatedPosition;
  }

  async deletePosition(id: number): Promise<void> {
    if (!this.positions.has(id)) {
      throw new Error(`Position with id ${id} not found`);
    }
    this.positions.delete(id);
  }

  // Candidate operations
  async getCandidates(filters?: {
    position?: string;
    status?: string;
    search?: string;
  }): Promise<Candidate[]> {
    let candidatesList = Array.from(this.candidates.values());
    
    if (filters) {
      if (filters.position) {
        candidatesList = candidatesList.filter(c => c.positionApplied === filters.position);
      }
      
      if (filters.status) {
        candidatesList = candidatesList.filter(c => c.status === filters.status);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        candidatesList = candidatesList.filter(c => 
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return candidatesList.sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateB - dateA;
    });
  }

  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const newCandidate: Candidate = {
      id: this.nextCandidateId++,
      email: candidate.email,
      name: candidate.name,
      phone: candidate.phone,
      positionApplied: candidate.positionApplied,
      status: candidate.status || "New",
      resume: candidate.resume || null,
      positionId: candidate.positionId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.candidates.set(newCandidate.id, newCandidate);
    return newCandidate;
  }

  async updateCandidate(id: number, candidate: Partial<InsertCandidate>): Promise<Candidate> {
    const existingCandidate = this.candidates.get(id);
    if (!existingCandidate) {
      throw new Error(`Candidate with id ${id} not found`);
    }
    
    const updatedCandidate: Candidate = {
      ...existingCandidate,
      ...candidate,
      updatedAt: new Date(),
    };
    this.candidates.set(id, updatedCandidate);
    return updatedCandidate;
  }

  async deleteCandidate(id: number): Promise<void> {
    if (!this.candidates.has(id)) {
      throw new Error(`Candidate with id ${id} not found`);
    }
    this.candidates.delete(id);
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalPositions: number;
    totalCandidates: number;
    inReview: number;
    shortlisted: number;
  }> {
    const candidatesList = Array.from(this.candidates.values());
    
    return {
      totalPositions: this.positions.size,
      totalCandidates: candidatesList.length,
      inReview: candidatesList.filter(c => c.status === "In Review").length,
      shortlisted: candidatesList.filter(c => c.status === "Shortlisted").length,
    };
  }
}

export const storage = new MemStorage();
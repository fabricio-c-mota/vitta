import User from "../entities/user"

interface CreateUserInput {
    id?: string;
    name: string;
    email: string;
    role: 'patient' | 'nutritionist';
}

function generateId(): string {
    if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
        return globalThis.crypto.randomUUID();
    }
    return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function makeUser(user: CreateUserInput): User {
    return {
        id: user.id ?? generateId(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date(),
    };
}

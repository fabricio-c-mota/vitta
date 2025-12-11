import User from "../entities/user"

interface CreateUserInput {
    name: string,
    email: string,
    role: 'patient' | 'nutritionist'
}

export function makeUser(user: CreateUserInput): User {
    return {
        id: crypto.randomUUID(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date(),
    }
}
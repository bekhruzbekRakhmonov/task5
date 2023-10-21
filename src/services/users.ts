import { pool } from '../db'
import HttpException from '../exceptions/http-exception'
import { User, UserRow } from '../interfaces/user'

export async function createUser(newUser: {
    name: string
    email: string
    password: string
}): Promise<boolean> {
    try {
        const { name, email, password } = newUser
        const user = await findByEmail(email)
        if (user) {
            throw new HttpException(400, 'User already exists')
        }

        await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password],
        )
        return true
    } catch (error) {
        throw error
    }
}

export async function findByEmail(email: string): Promise<User | null> {
    try {
        const [rows, fields] = await pool.execute<UserRow[]>(
            'SELECT * FROM users WHERE email = ?',
            [email],
        )

        if (rows.length > 0) {
            return rows[0]
        }
        return null
    } catch (error) {
        throw error
    }
}

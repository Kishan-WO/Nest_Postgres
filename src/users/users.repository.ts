import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { PG_CONNECTION } from "../database/database.providers";
import { CreateUserDTO } from "./dto/createUser.dto";
import { UpdateUserDTO } from "./dto/updateUser.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersRepository {
    constructor(
        @Inject(PG_CONNECTION) private readonly pool: Pool,
    ) { }

    async createUser(
        createUserDto: CreateUserDTO,
        avatar: { url: string; public_id: string },
    ): Promise<User> {
        const { name, email, password } = createUserDto;
        const query = `
            INSERT INTO users (name, email, password, avatar_url, avatar_public_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, avatar_url, avatar_public_id, created_at, updated_at
        `;
        const result = await this.pool.query<User>(query, [
            name,
            email,
            password,
            avatar.url,
            avatar.public_id,
        ]);
        return result.rows[0];
    }

    async findUserById(id: number): Promise<User | null> {
        const query = `SELECT id, name, email, avatar_url, avatar_public_id, created_at, updated_at FROM users WHERE id = $1`;
        const result = await this.pool.query<User>(query, [id]);
        return result.rows[0] || null;
    }

    async findAllUsers(): Promise<User[]> {
        const query = `SELECT id, name, email, avatar_url, avatar_public_id, created_at, updated_at FROM users ORDER BY id ASC`;
        const result = await this.pool.query<User>(query);
        return result.rows;
    }

    async updateUser(
        id: number,
        updateUserDto: UpdateUserDTO,
        avatar?: { url: string; public_id: string },
    ): Promise<User | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateUserDto.name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(updateUserDto.name);
        }
        if (updateUserDto.email !== undefined) {
            updates.push(`email = $${paramIndex++}`);
            values.push(updateUserDto.email);
        }
        if (updateUserDto.password !== undefined) {
            updates.push(`password = $${paramIndex++}`);
            values.push(updateUserDto.password);
        }
        if (avatar) {
            updates.push(`avatar_url = $${paramIndex++}`);
            values.push(avatar.url);
            updates.push(`avatar_public_id = $${paramIndex++}`);
            values.push(avatar.public_id);
        }

        if (updates.length === 0) {
            return this.findUserById(id);
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE users
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING id, name, email, avatar_url, avatar_public_id, created_at, updated_at
        `;

        const result = await this.pool.query<User>(query, values);
        return result.rows[0] || null;
    }

    async deleteUser(id: number): Promise<User | null> {
        const query = `DELETE FROM users WHERE id = $1 RETURNING id, name, email, avatar_url, avatar_public_id, created_at, updated_at`;
        const result = await this.pool.query<User>(query, [id]);
        return result.rows[0] || null;
    }
}

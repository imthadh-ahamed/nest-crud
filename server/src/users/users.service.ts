import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if email already exists using raw SQL query
      const existingUsers = await this.sequelize.query(
        'SELECT * FROM users WHERE email = :email LIMIT 1',
        {
          replacements: { email: createUserDto.email },
          type: 'SELECT',
        },
      );

      if (existingUsers && (existingUsers as any[]).length > 0) {
        throw new Error('Email already exists');
      }

      // Create user using raw SQL query
      const [result]: any = await this.sequelize.query(
        `INSERT INTO users (id, name, email, role, created_at, updated_at) 
         VALUES (uuid_generate_v4(), :name, :email, :role, NOW(), NOW()) 
         RETURNING *`,
        {
          replacements: {
            name: createUserDto.name,
            email: createUserDto.email,
            role: createUserDto.role || 'user',
          },
          type: 'INSERT',
        },
      );

      return result[0] as User;
    } catch (error) {
      throw new Error(error.message || 'Failed to create user');
    }
  }

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    try {
      const users = await this.sequelize.query(
        'SELECT * FROM users ORDER BY created_at DESC',
        {
          type: 'SELECT',
        },
      );
      return users as User[];
    } catch (error) {
      throw new Error('Failed to retrieve users');
    }
  }

  /**
   * Get a single user by ID
   */
  async findOne(id: string): Promise<User | null> {
    try {
      const users = await this.sequelize.query(
        'SELECT * FROM users WHERE id = :id LIMIT 1',
        {
          replacements: { id },
          type: 'SELECT',
        },
      );

      if (!users || (users as any[]).length === 0) {
        return null;
      }

      return (users as any[])[0] as User;
    } catch (error) {
      throw new Error('Failed to retrieve user');
    }
  }

  /**
   * Update a user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      // Check if user exists
      const user = await this.findOne(id);
      if (!user) {
        return null;
      }

      // If email is being updated, check if it's already taken
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUsers = await this.sequelize.query(
          'SELECT * FROM users WHERE email = :email AND id != :id LIMIT 1',
          {
            replacements: { email: updateUserDto.email, id },
            type: 'SELECT',
          },
        );

        if (existingUsers && (existingUsers as any[]).length > 0) {
          throw new Error('Email already exists');
        }
      }

      // Build dynamic update query
      const updates: string[] = [];
      const replacements: any = { id };

      if (updateUserDto.name) {
        updates.push('name = :name');
        replacements.name = updateUserDto.name;
      }
      if (updateUserDto.email) {
        updates.push('email = :email');
        replacements.email = updateUserDto.email;
      }
      if (updateUserDto.role) {
        updates.push('role = :role');
        replacements.role = updateUserDto.role;
      }

      if (updates.length === 0) {
        return user;
      }

      updates.push('updated_at = NOW()');

      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = :id RETURNING *`;

      const [result]: any = await this.sequelize.query(query, {
        replacements,
        type: 'UPDATE',
      });

      return result[0] as User;
    } catch (error) {
      throw new Error(error.message || 'Failed to update user');
    }
  }

  /**
   * Delete a user
   */
  async remove(id: string): Promise<boolean> {
    try {
      // Check if user exists
      const user = await this.findOne(id);
      if (!user) {
        return false;
      }

      await this.sequelize.query('DELETE FROM users WHERE id = :id', {
        replacements: { id },
        type: 'DELETE',
      });

      return true;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
}

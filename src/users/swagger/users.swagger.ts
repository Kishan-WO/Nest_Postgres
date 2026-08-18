import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiFindAllUsersDocs() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: "Get all users (Admin Only)",
            description: "Retrieves a list of all registered users. Restricted to Admin role.",
        }),
        ApiResponse({ status: 200, description: 'Users retrieved successfully.' }),
        ApiResponse({ status: 401, description: 'Unauthorized token missing or invalid.' }),
        ApiResponse({ status: 403, description: 'Forbidden: Requires Admin role.' }),
    );
}

export function ApiFindUserByIdDocs() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: "Get user by ID",
            description: "Retrieves details of a specific user by ID",
        }),
        ApiParam({ name: 'id', description: 'User ID', example: 1 }),
        ApiResponse({ status: 200, description: 'User retrieved successfully.' }),
        ApiResponse({ status: 404, description: 'User not found.' }),
    );
}

export function ApiCreateUserDocs() {
    return applyDecorators(
        ApiConsumes('multipart/form-data'),
        ApiOperation({
            summary: "Create a new user",
            description: "Creates a new user with the provided details and mandatory avatar file upload",
        }),
        ApiBody({
            schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'file'],
                properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'secret123' },
                    role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                    file: {
                        type: 'string',
                        format: 'binary',
                        description: 'User avatar file',
                    },
                },
            },
        }),
        ApiResponse({ status: 201, description: 'User created successfully.' }),
    );
}

export function ApiUpdateUserDocs() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiConsumes('multipart/form-data'),
        ApiOperation({
            summary: "Update user details",
            description: "Updates user details (name, email, password) and optionally replaces the avatar file",
        }),
        ApiParam({ name: 'id', description: 'User ID', example: 1 }),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'secret123' },
                    role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                    file: {
                        type: 'string',
                        format: 'binary',
                        description: 'Optional new user avatar file',
                    },
                },
            },
        }),
        ApiResponse({ status: 200, description: 'User updated successfully.' }),
        ApiResponse({ status: 404, description: 'User not found.' }),
    );
}

export function ApiDeleteUserDocs() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: "Delete user (Admin Only)",
            description: "Deletes a user by ID and removes their avatar from Cloudinary. Restricted to Admin role.",
        }),
        ApiParam({ name: 'id', description: 'User ID', example: 1 }),
        ApiResponse({ status: 200, description: 'User deleted successfully.' }),
        ApiResponse({ status: 403, description: 'Forbidden: Requires Admin role.' }),
        ApiResponse({ status: 404, description: 'User not found.' }),
    );
}

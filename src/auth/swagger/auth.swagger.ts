import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiSignUpDocs() {
    return applyDecorators(
        ApiConsumes('multipart/form-data'),
        ApiOperation({
            summary: 'Register a new user',
            description: 'Registers a user with avatar upload and sets JWT token in HTTP-only cookie',
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
                    file: { type: 'string', format: 'binary', description: 'Avatar image file' },
                },
            },
        }),
        ApiResponse({ status: 201, description: 'User registered successfully. JWT token set in HTTP-only cookie.' }),
    );
}

export function ApiSignInDocs() {
    return applyDecorators(
        ApiConsumes('application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'),
        ApiOperation({
            summary: 'Sign in user',
            description: 'Authenticates user with email and password, setting JWT token in HTTP-only cookie',
        }),
        ApiResponse({ status: 200, description: 'User authenticated successfully. JWT token set in HTTP-only cookie.' }),
        ApiResponse({ status: 401, description: 'Invalid email or password.' }),
    );
}

export function ApiSignOutDocs() {
    return applyDecorators(
        ApiOperation({ summary: 'Sign out user', description: 'Signs out the user' }),
        ApiResponse({ status: 200, description: 'User signed out successfully.' }),
    );
}

export function ApiGetProfileDocs() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Get current profile', description: 'Returns current authenticated user payload' }),
        ApiResponse({ status: 200, description: 'User profile retrieved successfully.' }),
        ApiResponse({ status: 401, description: 'Unauthorized token missing or invalid.' }),
    );
}

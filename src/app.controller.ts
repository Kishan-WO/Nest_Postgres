import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("health")
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({
    status: 200,
    description: 'System is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        timestamp: { type: 'number', example: 1700000000000 },
      },
    },
  })
  health(): {
    status: string,
    timestamp: number
  } {
    return {
      status: "OK",
      timestamp: Date.now()
    }
  }

  @Get("hello")
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Hello message',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}


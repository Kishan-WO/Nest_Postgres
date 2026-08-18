import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
    transform(value: string, metadata: ArgumentMetadata): number {
        const val = parseInt(value, 10);

        if (isNaN(val) || val <= 0) {
            const paramName = metadata.data ? `'${metadata.data}'` : 'Parameter';
            throw new BadRequestException(`${paramName} must be a positive integer greater than 0`);
        }

        return val;
    }
}

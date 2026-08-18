import { PipeTransform, Injectable, ArgumentMetadata, Logger } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
    private readonly logger = new Logger(TrimPipe.name);

    transform(value: any, metadata: ArgumentMetadata) {
        this.logger.log(`[TrimPipe Metadata] type: ${metadata.type}, metatype: ${metadata.metatype?.name || 'undefined'}, data: ${metadata.data}`);
        if (typeof value === 'string') {
            return value.trim();
        }
        if (typeof value === 'object' && value !== null) {
            for (const key of Object.keys(value)) {
                if (typeof value[key] === 'string') {
                    value[key] = value[key].trim();
                }
            }
        }
        return value;
    }
}
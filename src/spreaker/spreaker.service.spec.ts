import { Test, TestingModule } from '@nestjs/testing';
import { SpreakerService } from './spreaker.service';

describe('SpreakerService', () => {
  let service: SpreakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpreakerService],
    }).compile();

    service = module.get<SpreakerService>(SpreakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

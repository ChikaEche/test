import { Test, TestingModule } from '@nestjs/testing';
import { IHeartService } from './i-heart.service';

describe('IHeartService', () => {
  let service: IHeartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IHeartService],
    }).compile();

    service = module.get<IHeartService>(IHeartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

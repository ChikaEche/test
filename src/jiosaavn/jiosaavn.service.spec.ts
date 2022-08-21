import { Test, TestingModule } from '@nestjs/testing';
import { JiosaavnService } from './jiosaavn.service';

describe('JiosaavnService', () => {
  let service: JiosaavnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JiosaavnService],
    }).compile();

    service = module.get<JiosaavnService>(JiosaavnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

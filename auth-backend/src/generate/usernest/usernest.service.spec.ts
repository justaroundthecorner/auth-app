import { Test, TestingModule } from '@nestjs/testing';
import { UsernestService } from './usernest.service';

describe('UsernestService', () => {
  let service: UsernestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsernestService],
    }).compile();

    service = module.get<UsernestService>(UsernestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

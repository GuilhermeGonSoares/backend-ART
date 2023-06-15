import { Test, TestingModule } from '@nestjs/testing';
import { AutentiqueService } from './autentique.service';

describe('AutentiqueService', () => {
  let service: AutentiqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutentiqueService],
    }).compile();

    service = module.get<AutentiqueService>(AutentiqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
